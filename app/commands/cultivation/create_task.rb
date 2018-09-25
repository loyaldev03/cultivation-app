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
      task = batch.tasks.create(args.except(:task_related_id, :position))

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
