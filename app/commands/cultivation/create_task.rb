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
      # FIXME: This is only valid if "Add task below" TASK#439
      argument[:parent_id] = if task_related.is_phase || task_related.is_category
                               task_related.id
                             else
                               task_related.parent_id
                             end
      task = batch.tasks.create(argument)

      if args[:position] == 'top'
        task.move_to! task_related.position
      else
        position = (task_related.position + 1)
        task.move_to! position
      end
      task
    end
  end
end
