module Cultivation
  class UpdateTaskPosition
    prepend SimpleCommand

    def initialize(task_id, drop_on_id, current_user)
      @task_id = task_id&.to_bson_id
      @drop_on_id = drop_on_id&.to_bson_id
      @current_user = current_user
    end

    def call
      if valid_params?
        if task_to_move.nil?
          errors.add(:error, 'Task Not Found')
          return
        end
        if can_move? task_to_move
          drop_on = batch_tasks.detect { |t| t.id == @drop_on_id }
          move_node(task_to_move, drop_on)
          move_children(task_to_move)

          # If target have children, or task_to_move is deeper
          # move as child of target
          # if has_children?(drop_on)
          #   task_to_move.indent = drop_on.indent + 1
          #   task_to_move.parent_id = drop_on.id
          # else
          #   # Otherwise match target indent level
          #   task_to_move.indent = drop_on.indent
          #   task_to_move.parent_id = drop_on.parent_id
          # end

          task_to_move
        end
      end
    end

    private

    def move_node(task, drop_on)
      if task.indent > drop_on.indent
        task.indent = drop_on.indent + 1
        task.parent_id = drop_on.id
        task.move_to! get_new_position(task.position, drop_on.position)
        task
      end
    end

    def move_children(parent_node)
      ref_node = parent_node
      task_children.each do |t|
        move_node(t, ref_node)
        ref_node = t
      end
    end

    def get_new_position(task_position, drop_on_position)
      if task_position > drop_on_position
        drop_on_position + 1
      else
        drop_on_position
      end
    end

    def task_to_move
      @task_to_move ||= Cultivation::Task.includes(:batch).find_by(id: @task_id)
      @task_to_move
    end

    def task_to_move_wbs
      @task_to_move_wbs ||= batch_tasks.detect do |t|
        t.id == task_to_move.id
      end
      @task_to_move_wbs.wbs
    end

    def task_children
      @children ||= WbsTree.children(batch_tasks, task_to_move_wbs)
      @children
    end

    def batch_tasks
      @batch_tasks ||= Cultivation::QueryTasks.call(task_to_move.batch).result
      @batch_tasks
    end

    def valid_params?
      if @task_id.nil?
        errors.add(:error, 'Missing param :task_id - task to move')
        return false
      end
      if @drop_on_id.nil?
        errors.add(:error, 'Missing param :drop_on_id - drop on task')
        return false
      end
      true
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
