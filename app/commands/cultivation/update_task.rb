module Cultivation
  class UpdateTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(args)
      @args = args
    end

    def call
      update_task(@args)
    end

    def update_task(args)
      task = Cultivation::Task.find(args[:_id])
      task.update(args)
      tasks_changes = []
      find_changes(task, tasks_changes) #store into temp array
      bulk_update(tasks_changes) #bulk update
      # find_task_related(task)
      task
    end

    def find_changes(task, array)
      return if(task.children.count == 0 and task.tasks_depend.count == 0)

      task.children.each do |child|
        temp_child = child
        end_date = task.start_date + child.days.to_i.send('days')
        temp_child.start_date = task.start_date
        temp_child.end_date = end_date
        array << temp_child #store inside temp_array
        find_changes(child, array) #find childrens, pass array
      end

      task.tasks_depend.each do |depend_task|
        temp_depend_task = depend_task

        start_date = task.end_date + 1.days
        end_date = start_date + depend_task.days.to_i.send('days')

        temp_depend_task.start_date = start_date
        temp_depend_task.end_date = end_date
        array << temp_depend_task #store inside temp_array
        find_changes(depend_task, array) #find childrens, pass array
      end
    end

    def bulk_update(array)
      bulk_order = array.map do |arr|
        { update_one:
          {
            filter: { _id: arr.id },
            update: { :'$set' => {
              start_date: arr.start_date,
              end_date: arr.end_date
            }}
          }
        }
      end
      Cultivation::Task.collection.bulk_write(bulk_order)
    end


  end
end


    #def find_task_related(task)
#       return if(task.children.count == 0 and task.tasks_depend.count == 0)

#       task.children.each do |child|
#         end_date = task.start_date + child.days.to_i.send('days')
#         result = child.update(start_date: task.start_date, end_date: end_date)
#         find_task_related(child) #find childrens
#       end

#       task.tasks_depend.each do |depend_task|
#         start_date = task.end_date + 1.days
#         end_date = start_date + depend_task.days.to_i.send('days')
#         result = depend_task.update(start_date: start_date, end_date: end_date)
#         find_task_related(depend_task)
#       end
#     end

# ##################################

#seperate save and update
#assign all the tasks to a variable
#loop and change <- update -- can test the update
#loop and save <- save -- can test its save


