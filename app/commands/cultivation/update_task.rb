module Cultivation
  class UpdateTask
    prepend SimpleCommand

    REFTYPE_CHILDREN = 'children'.freeze
    REFTYPE_DEPENDENT = 'dependent'.freeze

    attr_reader :args, :task, :array

    def initialize(args = nil, current_user = nil, activate_batch = false)
      @args = args
      @current_user = current_user
      @activate_batch = activate_batch
    end

    def call
      task = Cultivation::Task.includes(:batch).find(@args[:id])
      if @args[:type] == 'resource'
        task.update(user_ids: @args[:user_ids])
      else
        batch = task.batch
        batch_tasks = Cultivation::QueryTasks.call(batch).result
        task = batch_tasks.detect { |t| t.id == task.id }
        if valid_batch? batch
          original_start_date = task.start_date
          batch.is_active = true if @activate_batch
          # Update task with args and re-calculate end_date
          task = map_args_to_task(task, @args)
          # Move subtasks's start date
          days_diff = (task.start_date - original_start_date) / 1.day
          children = task.children(batch_tasks)
          move_start_date(children, days_diff)

          # Save all changes to subtasks
          children.each(&:save)

          # Save if no errors
          task.save! if errors.empty?

          # opt = {
          #   facility_id: batch.facility_id,
          #   batch_id: batch.id,
          #   quantity: batch.quantity,
          # }

          # TODO::ANDY - valid_data when updating tasks

          # TODO::ANDY cascade changes? how?
          # if cascade_changes? task
          #   update_task(task, batch_tasks, opt)
          # end

          # TODO::ANDY: Estimated Hours are not calculating
          # Extend end date to Category and Phas

          # TODO::Andy do we need to update parent task's end date?
          # update_tasks_end_date(task, batch_tasks, opt)
          # Update batch
          update_batch(batch, batch_tasks&.first)
        end
      end
      task
    end

    private

    def cascade_changes?(task)
      # Update child and dependents tasks's start & end dates except
      # when task is Clean - doesn't effect parent or dependent tasks
      task.indelible != 'cleaning'
    end

    def map_args_to_task(task, args)
      # Only allow non-indelible task change these field
      if !task.indelible?
        task.name = args[:name]
        # This should remove depend_on when it's not available in args
        task.depend_on = args[:depend_on].present? ? args[:depend_on].to_bson_id : nil
        task.task_type = args[:task_type] || []
      end
      task.start_date = args[:start_date] if args[:start_date].present?
      task.duration = args[:duration].to_i if args[:duration].present?
      task.duration ||= 1
      task.end_date = task.start_date + task.duration.days
      # TODO: Calc estimated hours
      task.estimated_hours = args[:estimated_hours].to_f
      # TODO: Calc estimated cost
      task.estimated_cost = args[:estimated_cost].to_f
      task
    end

    def move_start_date(tasks = [], number_of_days = 0)
      if tasks.present? && number_of_days != 0
        tasks.each do |t|
          t.start_date = t.start_date + number_of_days.days
          t.duration ||= 1
          t.end_date = t.start_date + t.duration.days
        end
      end
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
      batch.save!
    end

    def update_task(task, batch_tasks, opt = {})
      # Store changed task into a an array for 'bulk' update later
      opt = {
        start_date: task.start_date,
        end_date: task.end_date,
        reference_task: task,
      }.merge(opt)
      tasks_changes = find_changes(task, batch_tasks, opt)
      if valid_data?(tasks_changes, opt)
        bulk_update(tasks_changes) # bulk update
      else
        Rails.logger.debug 'Invalid Data'
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

    # FIXME: This should be obsolete - remove after confirm
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
        children = task.children(batch_tasks)
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

    def valid_batch?(batch)
      if batch.facility_id.nil?
        errors.add(:facility_id, 'Missing Facility in Batch')
      end
      if batch.quantity.nil?
        errors.add(:quantity, 'Missing Quantity in Batch. Did you skipped quanity location selection?')
      end
      errors.empty? # No Errors => Valid
    end

    def valid_data?(tasks, opt = {})
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
            # overlapping_phase = existing_plans.pluck(:phase).uniq
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
        t.phase && Constants::CULTIVATION_PHASES_3V.include?(t.phase)
      end
    end
  end
end
