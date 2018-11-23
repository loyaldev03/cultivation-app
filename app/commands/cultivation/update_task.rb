module Cultivation
  class UpdateTask
    prepend SimpleCommand

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
        # Update child and dependents tasks's start & end dates
        update_task(task, batch_tasks)
        # Extend end date to Category and Phas
        update_tasks_end_date(task, batch_tasks)
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
      # Rails.logger.debug "`update_task method: #{task.name}`"
      # Rails.logger.debug "`start_date: #{task.start_date}`"
      # Rails.logger.debug "`end_date: #{task.end_date}`"
      # Rails.logger.debug "`duration: #{task.duration}`"
      # if date is changes, start_date, end_date and duration
      # Store changes into a an array for 'bulk' update later
      opt = {start_date: task.start_date}.merge(opt)
      tasks_changes = find_changes(task, batch_tasks, opt)
      # Rails.logger.debug "`total changes found: #{tasks_changes.length}`"

      if valid_data?(tasks_changes)
        bulk_update(tasks_changes) # bulk update
        task
      end
      task
    end

    def update_tasks_end_date(task, batch_tasks)
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

        update_task(parent, batch_tasks, children: false)
        update_tasks_end_date(parent, batch_tasks)

        parent.save unless errors.present?
      end
    end

    def update_position(task, position)
      task.move_to! position
    end

    def find_changes(task, batch_tasks = [], opt = {})
      opt = {
        start_date: nil,
        children: true,
        dependent: true,
      }.merge(opt) # default options
      raise ArgumentError, 'start_date' if opt[:start_date].nil?

      # Rails.logger.debug ">>> finding changes for #{task.name}"
      # Rails.logger.debug ">>> start_date: #{opt[:start_date]}"

      # Array to store changed tasks for current iteration
      new_changes = []

      # Update start_date, end_date & duration of current task
      set_task_dates(task, opt[:start_date])
      new_changes << task unless task.changes.empty?

      # Child task of current task & does not depend on any task
      children = get_children(task, batch_tasks)
      # Rails.logger.debug ">>> children: #{children.size}"

      # Tasks depends on current task, currently apply to "Phase" task that
      # positioned after the current task
      dependents = get_dependents(task, batch_tasks)
      # Rails.logger.debug ">>> dependents: #{dependents.size}"

      # Find changed child tasks
      if opt[:children]
        new_changes += find_cascaded_changes(children,
                                             batch_tasks,
                                             task.start_date)
      end

      # Find changed dependents tasks
      if opt[:dependent]
        new_changes += find_cascaded_changes(dependents,
                                             batch_tasks,
                                             task.end_date)
      end
      new_changes
    end

    def find_cascaded_changes(cascade_tasks, batch_tasks, start_date)
      new_changes = []
      cascade_tasks.each do |ref_task|
        new_changes += find_changes(ref_task,
                                    batch_tasks,
                                    start_date: start_date)
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

    def set_task_dates(ref_task, start_date)
      ref_task.start_date ||= start_date
      if start_date && ref_task.start_date < start_date
        # Change subtask's start date only if it's ealier than parent
        ref_task.start_date = start_date
      end
      if ref_task.start_date && ref_task.duration&.positive?
        ref_task.end_date = calc_end_date(ref_task.start_date,
                                          ref_task.duration)
      end
      if ref_task.start_date && ref_task.end_date
        ref_task.duration = calc_duration(ref_task.start_date,
                                          ref_task.end_date)
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

    def valid_data?(tasks)
      max_date = tasks.pluck(:end_date).compact.max
      min_date = tasks.pluck(:start_date).compact.min
      overlap_batch = false
      overlap_batch_name = ''
      Cultivation::Batch.all.not_in(:_id => tasks.first.try(:batch_id)).includes(:tasks).each do |batch|
        #get all phases
        phases = batch.tasks.select { |b| b.is_phase == true }
        #find cure or dry phase
        # Rails.logger.debug "Task Min => #{min_date}"
        # Rails.logger.debug "Task Max => #{max_date}"
        # Rails.logger.debug "Batch Start Date => #{batch.start_date}"

        phase = phases.pluck(:phase).include?('cure') ? phases.detect { |b| b.phase == 'cure' } : phases.detect { |b| b.phase == 'dry' }
        # Rails.logger.debug "Phase End Date => #{phase.end_date if phase}"

        if max_date && phase && phase.end_date &&
           ((phase.end_date >= min_date && batch.start_date <= max_date) ||
            (batch.start_date >= min_date && batch.start_date <= max_date) ||
            (batch.start_date <= min_date && phase.end_date >= max_date))
          overlap_batch = true
          overlap_batch_name = batch.batch_no
          break
        end
      end
      errors.add(:end_date, "The date overlaps with batch #{overlap_batch_name}") if overlap_batch
      errors.empty?
    end
  end
end

#TODO
#right now got two bulk_update
#top-bottom -> task and child and related task
#bottom-top -> task parent and parent, parent, parent
#combine top-bottom and bottom-top bulk_update
