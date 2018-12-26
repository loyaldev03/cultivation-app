module Cultivation
  class UpdateTaskPosition
    prepend SimpleCommand

    def initialize(task_id, position_task_id, current_user)
      @task_id = task_id&.to_bson_id
      @position_task_id = position_task_id&.to_bson_id
      @current_user = current_user
    end

    def call
      if valid_params?
        task_to_move = Cultivation::Task.find_by(id: @task_id)
        if task_to_move.nil?
          errors.add(:error, 'Task Not Found')
          return
        end
        if can_move? task_to_move
          batch_tasks = Cultivation::Task.
            where(batch_id: task_to_move.batch_id).
            order_by(position: :asc).
            to_a

          target_task = batch_tasks.detect { |t| t.id == @position_task_id }

          # If target have children, or task_to_move is deeper
          # move as child of target
          if has_children?(target_task, batch_tasks) ||
             task_to_move.indent > target_task.indent
            task_to_move.indent = target_task.indent + 1
            task_to_move.parent_id = target_task.id
          else
            # Otherwise match target indent level
            task_to_move.indent = target_task.indent
            task_to_move.parent_id = target_task.parent_id
          end

          if task_to_move.position > target_task.position
            task_to_move.move_to! target_task.position + 1
          else
            task_to_move.move_to! target_task.position
          end

          task_to_move
        end
      end
    end

    private

    def valid_params?
      if @task_id.nil?
        errors.add(:error, 'Missing param :task_id - task to move')
        return false
      end
      if @position_task_id.nil?
        errors.add(:error, 'Missing param :position_task_id - drop on task')
        return false
      end
      true
    end

    def has_children?(task, tasks)
      child = tasks.detect { |t| t.parent_id == task.id }
      if child
        true
      else
        false
      end
    end

    def can_move?(task)
      if task.indelible.present?
        errors.add(:error, "Task '#{task.name}' cannot be moved.")
        return false
      end
      true
    end
  end
end
