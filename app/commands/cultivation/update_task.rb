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
        # @args[:start_date] = @args[:start_date].to_date if @args[:start_date]
        # @args[:end_date] = @args[:end_date].to_date if @args[:end_date]

        # if @args[:duration].present? && task.duration != @args[:duration]
        #   @args[:end_date] = @args[:start_date] + @args[:duration].to_i.send('days')
        # end

        task.assign_attributes(@args)
        update_task(task, @args)
        update_tasks_end_date(task) if task.parent #extend end date to category , and phase
        task.save unless errors.present?

        #update batch estimated_harvest_date
        batch = task.batch
        dry_phase = batch.tasks.find_by(is_phase: true, phase: 'dry') ### NOTE can be Cure also
        batch_start_date = batch.tasks.first
        args = {}
        args[:estimated_harvest_date] = dry_phase.start_date if dry_phase && dry_phase.start_date != batch.estimated_harvest_date
        args[:start_date] = batch_start_date.start_date if batch_start_date && batch_start_date.start_date != batch.start_date
        batch.update(args)
      end
      task
    end

    def update_tasks_end_date(task)
      args = {}

      if task.parent
        children = task.parent.children.not_in(:_id => task.id)

        durations = children.map { |a| a['duration'] }
        durations << task.duration

        end_date = children.map { |a| a['end_date'] }
        end_date << task.end_date

        args[:duration] = durations.compact.sum
        child_max_end_date = end_date.compact.max #get children task maximum end_date
        args[:end_date] = child_max_end_date if (child_max_end_date && child_max_end_date > task.parent.end_date)

        task_parent = task.parent
        task_parent.assign_attributes(args)

        update_task(task.parent, args, {children: false})
        update_tasks_end_date(task.parent)

        task_parent.save unless errors.present?
      end
    end

    def update_position(task, position)
      task.move_to! (position)
    end

    def update_task(task, args, opt = {})
      tasks_changes = []
      #if date is changes, start_date, end_date and duration
      find_changes(task, tasks_changes, opt) #store into temp array
      if valid_data?(tasks_changes)
        bulk_update(tasks_changes) #bulk update
        task
      end
      task
    end

    def find_changes(task, array, opt = {})
      return if (task.children.count == 0 and task.tasks_depend.count == 0)

      if opt[:children] != false #used for avoid updating children task
        task.children.each do |child|
          if child.depend_on.nil?
            temp_child = child
            end_date = (task.start_date + child.duration.to_i.send('days')) - 1.days if child.duration && task.start_date
            temp_child.start_date = task.start_date
            temp_child.end_date = end_date if end_date
            array << temp_child #store inside temp_array
            find_changes(child, array) #find childrens, pass array
          end
        end
      end

      if opt[:dependent] != false #used for avoid updating dependent task
        task.tasks_depend.each do |depend_task|
          temp_depend_task = depend_task

          start_date = task.end_date + 1.days if task.end_date
          end_date = (start_date + depend_task.duration.to_i.send('days')) - 1.days if start_date && depend_task.duration

          temp_depend_task.start_date = start_date
          temp_depend_task.end_date = end_date
          array << temp_depend_task #store inside temp_array
          find_changes(depend_task, array) #find childrens, pass array
        end
      end
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
