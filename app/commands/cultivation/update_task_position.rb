module Cultivation
  class UpdateTaskPosition
    prepend SimpleCommand

    def initialize(task_id, move_to_position, current_user)
      @task_id = task_id
      @move_to_position = move_to_position
      @current_user = current_user
    end

    def call
      task = Cultivation::Task.find_by(id: @task_id)
      if task.nil?
        errors.add(:error, 'Task Not Found')
        return
      end
      if can_move? task
        task.move_to! @move_to_position
        task
      end
    end

    private

    def can_move?(task)
      if task.indelible
        errors.add(:error, "Task '(#{task.name})'' cannot be moved.")
        return false
      end
      true
    end
  end
end
