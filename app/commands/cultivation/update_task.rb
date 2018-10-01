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
        update_task(task, @args)
        #check if current task end_date is beyond end_date of parent
        #update parent task and (depending task) only using => {children: false} to avoid updating children task

        # TO DO should this update task be recursive ? what if parent task end_date is extended beyond its parent task ?

        update_task(task.parent, {end_date: task.end_date}, {children: false}) if task.parent and (task.end_date > task.parent.end_date)
      end
      task
    end

    def update_position(task, position)
      task.move_to! (position)
    end

    def update_task(task, args, opt = {})
      args[:start_date] = args[:start_date].to_date if args[:start_date]
      args[:end_date] = args[:end_date].to_date if args[:end_date]
      task.update(args)
      tasks_changes = []
      find_changes(task, tasks_changes, opt) #store into temp array
      bulk_update(tasks_changes) #bulk update
      task
    end

    def find_changes(task, array, opt = {})
      return if (task.children.count == 0 and task.tasks_depend.count == 0)

      if opt[:children] != false #used for avoid updating children task
        task.children.each do |child|
          temp_child = child
          end_date = task.start_date + child.duration.to_i.send('days')
          temp_child.start_date = task.start_date
          temp_child.end_date = end_date
          array << temp_child #store inside temp_array
          find_changes(child, array) #find childrens, pass array
        end
      end

      if opt[:dependent] != true #used for avoid updating dependent task
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
