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
      argument = args.except(:task_related_id, :position, :action)
      argument[:batch_id] = task_related.batch_id
      argument[:phase] = task_related.phase
      argument[:indent] = task_related.indent
      argument[:indelible] = nil
      new_task = Cultivation::Task.create(argument)
      if args[:action] == 'add-above'
        new_task.move_to! task_related.position
      else
        tasks = Cultivation::QueryTasks.call(task_related.batch).result
        task_related = tasks.detect { |t| t.id == task_related.id }
        have_children = get_children(tasks, task_related.wbs).any?
        new_task.indent = task_related.indent + 1 if have_children
        new_task.move_to! task_related.position + 1
      end
      new_task
    end

    def get_children(batch_tasks, task_wbs)
      WbsTree.children(batch_tasks, task_wbs)
    end
  end
end
