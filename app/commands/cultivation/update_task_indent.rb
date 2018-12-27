module Cultivation
  class UpdateTaskIndent
    prepend SimpleCommand

    def initialize(task_id, indent_action, current_user)
      @task_id = task_id
      @indent_action = indent_action
      @current_user = current_user
    end

    def call
      if valid_params?
        task_to_indent = Cultivation::Task.find_by(id: @task_id)
        if can_indent?(task_to_indent)
          if @indent_action == 'in'
            task_to_indent.indent += 1
          elsif @indent_action == 'out' && task_to_indent.indent > 1
            task_to_indent.indent -= 1
          end
          task_to_indent.save!
          task_to_indent
        end
      end
    end

    private

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

    def can_indent?(task_to_indent)
      if task_to_indent.indelible.present? && task_to_indent.indelible
        errors.add(:id, "Cannot indent indelible task: #{task_to_indent.name}")
        return false
      end
      true
    end
  end
end
