module Cultivation
  class UpdateTask
    prepend SimpleCommand

    REFTYPE_CHILDREN = 'children'.freeze
    REFTYPE_DEPENDENT = 'dependent'.freeze

    attr_reader :args, :task, :array

    def initialize(args = nil)
      @args = args
    end

    def call
      task = Cultivation::Task.find(@args[:id])
      if @args[:type] == 'position'
        update_position(task, @args[:position])
      elsif @args[:type] == 'resource'
        task.update(user_ids: @args[:user_ids])
      else
        batch = Cultivation::Batch.includes(:tasks).find(task.batch_id)
        batch_tasks = batch.tasks
        task.assign_attributes(@args)
        opt = {
          facility_id: batch.facility_id,
          batch_id: batch.id,
          quantity: batch.quantity,
        }
        # Update child and dependents tasks's start & end dates
        update_task(task, batch_tasks, opt)
        # Extend end date to Category and Phas
        update_tasks_end_date(task, batch_tasks, opt)
        # Update batch
        update_batch(batch, batch_tasks&.first)
      end
      task
    end

    def update_batch(batch, first_task)
      # Here we assume estimated harvest date is the start date of :dry phase
      # (or :cure, when :dry not found)
      harvest_phase = Cultivation::Task.
        where(batch_id: batch.id,
              is_phase: true,
              :phase.in => [Constants::CONST_DRY,
                            Constants::CONST_CURE]).first
      batch.estimated_harvest_date = harvest_phase.start_date if harvest_phase
      batch.start_date = first_task.start_date if first_task
      batch.save
    end

    def update_task(task, batch_tasks, opt = {})
      raise ArgumentError, 'facility_id is required' if opt[:facility_id].nil?
      raise ArgumentError, 'batch_id is required' if opt[:batch_id].nil?
      raise ArgumentError, 'quantity is required' if opt[:quantity].nil?

      # Rails.logger.debug "update_task task.name: `#{task.name}`"
      # Rails.logger.debug "task.start_date: `#{task.start_date.to_date}`"
      # Rails.logger.debug "task.end_date: `#{task.end_date.to_date}`"
      # Store changed task into a an array for 'bulk' update later
      opt = {
        start_date: task.start_date,
        end_date: task.end_date,
        reference_task: task,
      }.merge(opt)
      tasks_changes = find_changes(task, batch_tasks, opt)
      # Rails.logger.debug "`total changes found: #{tasks_changes.length}`"

      if valid_data?(tasks_changes, opt)
        bulk_update(tasks_changes) # bulk update
        task
      end
      task
    end

    def update_tasks_end_date(task, batch_tasks, opt = {})
      raise ArgumentError, 'facility_id is required' if opt[:facility_id].nil?
      raise ArgumentError, 'batch_id is required' if opt[:batch_id].nil?

      parent = batch_tasks.detect { |t| t.id.to_s == task.parent_id.to_s }
      if parent
        # Get all sibling tasks, including current task
        siblings = get_siblings(task, batch_tasks)
        # Get siblings max end_date (latest date)
        max_end_date = siblings.map(&:end_date).compact.max

        if parent&.end_date
          # Extend parent's end date if any siblings have later end_date
          if max_end_date && max_end_date > parent.end_date
            parent.end_date = max_end_date
          end

          # Re-calculate parent's duration
          if parent&.start_date
            parent.duration = calc_duration(parent.start_date,
                                            parent.end_date)
          end
        end

        update_task(parent, batch_tasks, {children: false}.merge(opt))
        update_tasks_end_date(parent, batch_tasks, opt)

        parent.save unless errors.present?
      end
    end

    def update_position(task, position)
      task.move_to! position
    end

    def find_changes(task, batch_tasks = [], opt = {})
      opt = {
        start_date: nil,
        end_date: nil,
        reference_task: nil,
        children: true,
        dependent: true,
      }.merge(opt) # default options

      if opt[:start_date].nil?
        ref_task = opt[:reference_task]
        errors.add(:start_date,
                   "'Start At' is required - #{ref_task&.name}")
        return []
      end

      # Array to store changed tasks for current iteration
      new_changes = []

      # Update start_date, end_date & duration of current task
      set_task_dates(task, opt[:start_date])
      new_changes << task unless task.changes.empty?

      if opt[:children]
        # Child task of current task & does not depend on any task
        children = get_children(task, batch_tasks)
        # Find changed child tasks
        new_changes += find_cascaded_changes(children,
                                             batch_tasks,
                                             REFTYPE_CHILDREN,
                                             task)
      end

      if opt[:dependent]
        # Tasks depends on current task, currently apply to "Phase" task that
        # positioned after the current task
        dependents = get_dependents(task, batch_tasks)
        # Find changed dependents tasks
        new_changes += find_cascaded_changes(dependents,
                                             batch_tasks,
                                             REFTYPE_DEPENDENT,
                                             task)
      end
      new_changes
    end

    def find_cascaded_changes(cascade_tasks, batch_tasks, ref_type, ref_task)
      new_changes = []

      ref_start_date = ref_task.end_date if ref_type == REFTYPE_DEPENDENT
      ref_start_date ||= ref_task.start_date

      cascade_tasks.each do |cascade_task|
        new_changes += find_changes(cascade_task,
                                    batch_tasks,
                                    start_date: ref_start_date,
                                    reference_task: ref_task)
      end

      new_changes
    end

    # Find all subtasks
    def get_children(task, batch_tasks)
      batch_tasks.select do |t|
        t.parent_id &&
          # Sub-tasks should have parent set to current task
          t.parent_id.to_s == task.id.to_s
      end
    end

    # Find all subtasks
    def get_dependents(task, batch_tasks)
      batch_tasks.select do |t|
        t.depend_on &&
          # Dependent tasks should have depends on set to current task
          t.depend_on.to_s == task.id.to_s
      end
    end

    # Find all siblings tasks
    def get_siblings(task, batch_tasks)
      result = batch_tasks.select do |t|
        t.parent_id &&
          # Sibling tasks should have same parent as current task
          t.parent_id.to_s == task.parent_id.to_s &&
          # Exclude current task since it might have updated value
          # from current iteration
          t.id.to_s != task.id.to_s
      end
      # Add back the updated version of current task
      result << task
    end

    # Calculate end_date based on start_date + duration
    def calc_end_date(start_date, duration = 0)
      raise ArgumentError, 'start_date' if start_date.nil?
      raise ArgumentError, 'duration' unless duration.is_a? Integer
      # Calculate end_date based on start_date + duration
      start_date + duration.days - 1.days
    end

    # Calculate duration between start & end date in days
    def calc_duration(start_date, end_date)
      raise ArgumentError, 'start_date' if start_date.nil?
      raise ArgumentError, 'end_date' if end_date.nil?
      raise ArgumentError, 'invalid start_date type' unless start_date.is_a? DateTime
      raise ArgumentError, 'invalid end_date type' unless end_date.is_a? DateTime

      duration = (end_date - start_date).to_i
      duration + 1
    end

    def set_task_dates(task, start_date)
      raise ArgumentError, 'task is required' if task.nil?
      raise ArgumentError, 'start_date is required' if start_date.nil?

      if task.start_date.nil? || task.start_date < start_date
        # Set task's start_date if it's ealier than parent start_date
        task.start_date = start_date
      end

      if task.duration&.positive?
        task.end_date = calc_end_date(task.start_date,
                                      task.duration)
      end

      if task.end_date
        task.duration = calc_duration(task.start_date,
                                      task.end_date)
      end
    end

    def bulk_update(array)
      bulk_order = array.map do |task|
        {update_one: {
          filter: {_id: task.id},
          update: {'$set': {
            start_date: task.start_date,
            end_date: task.end_date,
            duration: task.duration,
          }},
        }}
      end
      Cultivation::Task.collection.bulk_write(bulk_order)
    end

    def valid_data?(tasks, opt = {})
      raise ArgumentError, 'facility_id is required' if opt[:facility_id].nil?
      raise ArgumentError, 'batch_id is required' if opt[:batch_id].nil?
      raise ArgumentError, 'quantity is required' if opt[:quantity].nil?
      # max_date = tasks.pluck(:end_date).compact.max
      # min_date = tasks.pluck(:start_date).compact.min
      # overlap_batch = false
      # overlap_batch_name = ''
      # Find "Phase" tasks that has changes
      phase_tasks = get_phase_tasks(tasks)
      phase_tasks.each do |t|
        # Rails.logger.debug ">>> phase_tasks, #{t.name} - #{t.phase}"
        # Rails.logger.debug ">>> phase_dates, #{t.start_date} - #{t.end_date}"
        args = {
          facility_id: opt[:facility_id],
          exclude_batch_id: opt[:batch_id],
          phase: t.phase,
          start_date: t.start_date,
          end_date: t.end_date,
        }
        available_capacity = QueryAvailableCapacity.call(args).result
        # Rails.logger.debug "required capacity: #{opt[:quantity]}"
        # Rails.logger.debug "available capacity: #{available_capacity}"
        if opt[:quantity] > available_capacity
          error_message = "Not enough capacity on selected dates in #{t.name}. "
          existing_plans = QueryPlannedTrays.call(t.start_date,
                                                  t.end_date,
                                                  opt[:facility_id],
                                                  opt[:batch_id]).result
          if !existing_plans.empty?
            existing_plans = existing_plans.select { |p| p.phase == t.phase }
            batch_ids = existing_plans.pluck(:batch_id).uniq
            overlapping_phase = existing_plans.pluck(:phase).uniq
            # Rails.logger.debug batch_ids
            # Rails.logger.debug overlapping_phase
            batch_nos = Cultivation::Batch.
              where(:id.in => batch_ids).
              pluck(:batch_no)
            if !batch_nos.empty?
              error_message += 'Overlapping tray planning with batch: '
              error_message += batch_nos.join(', ') if !batch_nos.empty?
            end
            errors.add(:end_date, error_message)
          end
          break
        end
      end
      errors.empty?
    end

    def get_phase_tasks(tasks)
      # Find "Phase" tasks only
      tasks.select do |t|
        Constants::CULTIVATION_PHASES_3V.include?(t.phase) &&
          t.is_phase == true &&
          t.phase
      end
    end
  end
end

#TODO
#right now got two bulk_update
#top-bottom -> task and child and related task
#bottom-top -> task parent and parent, parent, parent
#combine top-bottom and bottom-top bulk_update
