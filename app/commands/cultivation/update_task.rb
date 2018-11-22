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
        Rails.logger.debug 'args >>> '
        Rails.logger.debug args.to_yaml
        batch = Cultivation::Batch.includes(:tasks).find(task.batch_id)
        batch_tasks = batch.tasks
        Rails.logger.debug ">>> number of tasks: #{batch_tasks.size}"
        task.assign_attributes(@args)
        # Update start_date, end_date & duration of current task
        set_task_dates(task, task.start_date)
        # Update child and dependents tasks's start & end dates
        update_task(task, batch_tasks)
        # Extend end date to Category and Phase
        update_tasks_end_date(task, batch_tasks)

        Rails.logger.debug errors.to_yaml
        Rails.logger.debug 'task.changes >>> '
        Rails.logger.debug task.changes.to_yaml
        task.save unless errors.present?

        # Update estimated harvest date
        # FIXME: Fallback to :cure also if :dry not found
        dry_phase = batch.tasks.find_by(is_phase: true, phase: 'dry')
        batch.estimated_harvest_date = dry_phase.start_date if dry_phase
        batch.start_date = batch.tasks.first.start_date if !batch.tasks.empty?
        batch.save
      end
      task
    end

    # TODO: This partially working, sometime not extending parent's end_date
    def update_tasks_end_date(task, batch_tasks)
      parent = batch_tasks.detect { |t| t.id.to_s == task.parent_id.to_s }
      if parent
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

    # Find all siblings tasks
    def get_siblings(task, batch_tasks)
      batch_tasks.select do |t|
        t.parent_id &&
          # Sibling should have same parent
          t.parent_id.to_s == task.parent_id.to_s
      end
    end

    def update_position(task, position)
      task.move_to! position
    end

    def update_task(task, batch_tasks, opt = {})
      Rails.logger.debug "`update_task method: #{task.name}`"
      Rails.logger.debug "`start_date: #{task.start_date}`"
      Rails.logger.debug "`end_date #{task.end_date}`"
      Rails.logger.debug "`duration #{task.duration}`"
      # if date is changes, start_date, end_date and duration
      # Store changes into a an array for 'bulk' update later
      tasks_changes = find_changes(task, batch_tasks, opt)
      if valid_data?(tasks_changes)
        bulk_update(tasks_changes) # bulk update
        task
      end
      task
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

    def find_changes(task, batch_tasks = [], opt = {})
      Rails.logger.debug ">>> finding changes for #{task.name}"
      opt = {children: true, dependent: true}.merge(opt) # default options

      # Child task of current task & does not depend on any task
      children = batch_tasks.select { |b| b.parent_id.to_s == task.id.to_s }
      Rails.logger.debug ">>> children: #{children.size}"

      # Tasks depends on current task
      dependents = batch_tasks.select { |b| b.depend_on.to_s == task.id.to_s }
      Rails.logger.debug ">>> dependents: #{dependents.size}"

      new_changes = []
      # Find changed child tasks
      if !children.empty? && opt[:children]
        new_changes += find_cascaded_changes(children,
                                             batch_tasks,
                                             task.start_date)
      end

      # Find changed dependents tasks
      if !dependents.empty? && opt[:dependent]
        new_changes += find_cascaded_changes(dependents,
                                             batch_tasks,
                                             task.end_date)
      end
      new_changes
    end

    def find_cascaded_changes(cascade_tasks, batch_tasks, start_date)
      new_changes = []
      cascade_tasks.each do |ref_task|
        set_task_dates(ref_task, start_date)
        new_changes << ref_task unless ref_task.changes.empty?
        new_changes += find_changes(ref_task, batch_tasks)
        Rails.logger.debug "# of new changes: #{new_changes.size}"
        Rails.logger.debug "New Changes: #{new_changes.last&.name}"
        Rails.logger.debug "Duration: #{new_changes.last&.duration}"
      end
      new_changes
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
        Rails.logger.debug "Task Min => #{min_date}"
        Rails.logger.debug "Task Max => #{max_date}"

        Rails.logger.debug "Batch Start Date => #{batch.start_date}"

        phase = phases.pluck(:phase).include?('cure') ? phases.detect { |b| b.phase == 'cure' } : phases.detect { |b| b.phase == 'dry' }
        Rails.logger.debug "Phase End Date => #{phase.end_date if phase}"

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
