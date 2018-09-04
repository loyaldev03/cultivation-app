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

    private

    def update_task(args)
      task = Cultivation::Task.find(args["_id"])
      task.update(args)
      find_task_related(task)
      task
    end


    def find_task_related(task)
      return if(task.children.count == 0 and task.tasks_depend.count == 0)

      task.children.each do |child|
        end_date = task.start_date + child.days.to_i.send('days')
        result = child.update(start_date: task.start_date, end_date: end_date)
        find_task_related(child) #find childrens
      end

      task.tasks_depend.each do |depend_task|
        start_date = task.end_date + 1.days
        end_date = start_date + depend_task.days.to_i.send('days')
        result = depend_task.update(start_date: start_date, end_date: end_date)
        find_task_related(depend_task)
      end
    end




  end
end