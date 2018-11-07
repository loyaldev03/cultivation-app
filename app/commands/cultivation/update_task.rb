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
      else
        @args[:start_date] = @args[:start_date].to_date if @args[:start_date]
        @args[:end_date] = @args[:end_date].to_date if @args[:end_date]

        if @args[:duration].present? && task.duration != @args[:duration]
          @args[:end_date] = @args[:start_date] + @args[:duration].to_i.send('days')
        end

        update_task(task, @args)
        update_tasks_end_date(task) if task.parent #extend end date to category , and phase
      end
      task
    end

    def update_tasks_end_date(task)
      args = {}
      args[:duration] = task.parent.children.sum(:duration) if task.parent
      if task.parent
        child_max_end_date = task.parent.children.map { |h| h[:end_date] }.compact.max #get children task maximum end_date
        args[:end_date] = child_max_end_date if (child_max_end_date && child_max_end_date > task.parent.end_date)
      end
      update_task(task.parent, args, {children: false}) if task.parent
      update_tasks_end_date(task.parent) if task.parent
    end

    def update_position(task, position)
      task.move_to! (position)
    end

    def update_task(task, args, opt = {})
      task.update(args)
      tasks_changes = []
      #if date is changes, start_date, end_date and duration
      find_changes(task, tasks_changes, opt) #store into temp array
      bulk_update(tasks_changes) #bulk update
      task
    end

    def find_changes(task, array, opt = {})
      return if (task.children.count == 0 and task.tasks_depend.count == 0)

      if opt[:children] != false #used for avoid updating children task
        task.children.each do |child|
          if child.depend_on.nil?
            temp_child = child
            end_date = task.start_date + child.duration.to_i.send('days')
            temp_child.start_date = task.start_date
            temp_child.end_date = end_date
            array << temp_child #store inside temp_array
            find_changes(child, array) #find childrens, pass array
          end
        end
      end

      if opt[:dependent] != false #used for avoid updating dependent task
        task.tasks_depend.each do |depend_task|
          temp_depend_task = depend_task

          start_date = task.end_date + 1.days
          end_date = start_date + depend_task.duration.to_i.send('days')

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
  end
end

#seperate save and update
#assign all the tasks to a variable
#loop and change <- update -- can test the update
#loop and save <- save -- can test its save
