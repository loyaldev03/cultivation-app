module Cultivation
  class CreateTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(args)
      @args = args
    end

    def call
      save_record(@args)
    end

    private

    def save_record(args)
      task_related = Cultivation::Task.find_by(id: args[:task_related_id])
      tasks = Cultivation::QueryTasks.call(task_related.batch).result
      argument = args.except(:task_related_id, :position, :action)
      argument[:indent] = task_related.indent
      argument[:batch_id] = task_related.batch_id
      argument[:indelible] = nil
      new_task = Cultivation::Task.create(argument)
      if args[:action] == 'add-above'
        new_task.move_to! task_related.position
      else
        new_task.move_to! task_related.position + 1
      end
      new_task
    end
  end
end
