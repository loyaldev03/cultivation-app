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
      task_related = Cultivation::Task.find(args[:task_related_id])
      batch = task_related.batch
      argument = args.except(:task_related_id, :position)
      argument[:parent_id] = task_related.parent_id
      task = batch.tasks.create(argument)

      if args[:position] == 'top'
        position = (task_related.position == 0 ? 0 : (task_related.position - 1))
        task.move_to! task_related.position
      else
        position = (task_related.position + 1)
        task.move_to! position
      end
      task
    end
  end
end
