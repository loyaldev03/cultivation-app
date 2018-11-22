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
        # Extend end date to Category and Phase
        update_tasks_end_date(task, batch_tasks) if task.parent

        task.save unless errors.present?

        # Update estimated harvest date
        # FIXME: Fallback to :cure also if :dry not found
        dry_phase = batch.tasks.find_by(is_phase: true, phase: 'dry')
        # FIXME: N+1
        batch.estimated_harvest_date = dry_phase.start_date if dry_phase
        batch.start_date = batch.tasks.first.start_date if !batch.tasks.empty?
        batch.save unless batch.changes.empty?
      end
      task
    end

    def update_tasks_end_date(task, batch_tasks)
      args = {}

      if task.parent
        children = task.parent.children.not_in(_id: task.id)

        durations = children.map { |a| a['duration'] }
        durations << task.duration

        end_date = children.map { |a| a['end_date'] }
        end_date << task.end_date

        # Get children task maximum end_date
        child_max_end_date = end_date.compact.max
        if task.parent&.end_date &&
           child_max_end_date &&
           child_max_end_date > task.parent.end_date
          args[:end_date] = child_max_end_date
        end
        if args[:end_date]
          args[:duration] = (args[:end_date].
            to_datetime - task.parent.start_date).to_i + 1
        end

        task_parent = task.parent
        task_parent.assign_attributes(args)

        update_task(task.parent, batch_tasks, children: false)
        update_tasks_end_date(task.parent, batch_tasks)

        task_parent.save unless errors.present?
      end
    end

    def update_position(task, position)
      task.move_to! position
    end

    def update_task(task, batch_tasks, opt = {})
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

    def find_changes(task, batch_tasks = [], opt = {})
      opt = {children: true, dependent: true}.merge(opt) # default options

      # Child task of current task & does not depend on any task
      children = batch_tasks.select do |b|
        b.parent_id.to_s == task.id.to_s && task.depend_on.nil?
      end

      # Tasks depends on current task
      dependents = batch_tasks.select { |b| b.depend_on.to_s == task.id.to_s }
      new_changes = []

      # Updating child tasks
      if !children.empty? && opt[:children]
        new_changes += find_cascaded_changes(children,
                                             batch_tasks,
                                             task.start_date)
      end

      # Updating dependent tasks
      if !dependents.empty? && opt[:dependent]
        new_changes += find_cascaded_changes(dependents,
                                             batch_tasks,
                                             task.end_date)
      end

      new_changes
    end

    def find_cascaded_changes(cascade_tasks, batch_tasks, start_date)
      new_changes = []
      cascade_tasks.each do |ref|
        ref.start_date = start_date if start_date
        if ref.start_date && ref.duration
          ref.end_date = calc_end_date(ref.start_date, ref.duration)
        end
        new_changes << ref unless ref.changes.empty?
        new_changes += find_changes(ref, batch_tasks)
      end
      new_changes
    end

    def bulk_update(array)
      bulk_order = array.map do |arr|
        {update_one: {
          filter: {_id: arr.id},
          update: {:'$set' => {
            start_date: arr.start_date,
            end_date: arr.end_date,
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
