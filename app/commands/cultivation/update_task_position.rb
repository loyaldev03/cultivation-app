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
      if task
        task.move_to! @move_to_position
        task
      else
        errors.add(:error, 'Task Not Found')
      end
    end
  end
end
