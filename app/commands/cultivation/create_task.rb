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
      task = Cultivation::Task.create(args.except(:task_related_id))
      if args[:position] == 'top'
        puts (task_related.position - 1)
        task.move_to! (task_related.position == 0 ? 0 : (task_related.position - 1))
      else
        task.move_to! (task_related.position + 1)
      end
      task
    end
  end
end
