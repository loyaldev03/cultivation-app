module Cultivation
  class UpdateTaskIndent
    prepend SimpleCommand

    def initialize(task_id, indent_action, current_user)
      @task_id = task_id&.to_bson_id
      @indent_action = indent_action
      @current_user = current_user
    end

    def call
      if valid_params? && can_indent?
        tasks = get_tasks(task_to_indent.batch)
        @task_to_indent = get_task(tasks, @task_id)
        children = get_children(tasks, task_to_indent.wbs)

        if can_indent_in?
          task_to_indent.indent += 1
          task_to_indent.save!
          children.each do |t|
            t.indent += 1
            t.save!
          end
        end

        if can_indent_out?
          task_to_indent.indent -= 1
          task_to_indent.save!
          children.each do |t|
            t.indent -= 1
            t.save!
          end
        end

        task_to_indent
      end
    end

    private

    def can_indent_in?
      @indent_action == 'in' && !task_to_indent.wbs.ends_with?('.1')
    end

    def can_indent_out?
      @indent_action == 'out' && task_to_indent.indent > 1
    end

    def print_current_order(batch)
      res = get_tasks(batch)
      output = res.map do |rec|
        {
          name: rec.name,
          wbs: rec.wbs,
          indent: rec.indent,
          position: rec.position,
        }
      end
      pp output
    end

    def get_tasks(batch)
      Cultivation::QueryTasks.call(batch).result
    end

    def get_task(batch_tasks, task_id)
      batch_tasks.detect { |t| t.id == task_id }
    end

    def get_children(batch_tasks, task_wbs)
      WbsTree.children(batch_tasks, task_wbs)
    end

    def task_to_indent
      @task_to_indent ||= Cultivation::Task.
        includes(:batch).
        find_by(id: @task_id)
    end

    def valid_params?
      if @task_id.nil?
        errors.add(:error, 'Missing param :task_id')
        return false
      end
      if @indent_action.nil?
        errors.add(:error, 'Missing param :indent_action')
        return false
      end
      true
    end

    def can_indent?
      if task_to_indent.nil?
        errors.add(:error, 'Task Not Found')
        return false
      end
      if task_to_indent.indelible.present? && task_to_indent.indelible
        errors.add(:id, "Cannot indent indelible task: #{task_to_indent.name}")
        return false
      end
      true
    end
  end
end
