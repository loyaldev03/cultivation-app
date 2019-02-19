module Cultivation
  class UpdateTaskPosition
    prepend SimpleCommand

    def initialize(current_user, task_id, drop_on_id)
      @current_user = current_user
      @task_id = task_id&.to_bson_id
      @drop_on_id = drop_on_id&.to_bson_id
    end

    def call
      if valid_params? && can_move?
        tasks = get_tasks(task_to_move.batch)
        @task_to_move = get_task(tasks, @task_id)
        drop_on = get_task(tasks, @drop_on_id)
        move_node(task_to_move, drop_on)

        children = task_to_move.children(tasks)
        move_children(children, task_to_move)
        task_to_move
      end
    end

    private

    def move_node(task, drop_on)
      first_sibling = nil
      if task.indent > drop_on.indent
        task.indent = drop_on.indent + 1
        new_position = get_new_position(task.position, drop_on.position)
      else
        task_ls = get_tasks(task.batch) # Use another task list to work with
        first_sibling = task.siblings(task_ls).first
        drop_on = get_task(task_ls, drop_on.id)
        drop_on_children = drop_on.children(task_ls)
        if drop_on_children&.any?
          new_position = get_new_position(task.position,
                                          drop_on_children.last.position)
        else
          new_position = get_new_position(task.position, drop_on.position)
        end
      end
      # print_current_order
      task.move_to! new_position

      # Call update task to cascade start_date changes. This is in case
      # where task is being moved as first child.
      Cultivation::UpdateTask.call(@current_user, task)

      # If task have a sibling - perform update to cascade start date changes.
      # This is in case where a first task has been moved, and the sibling take
      # it's plance as first child.
      if first_sibling
        Cultivation::UpdateTask.call(@current_user, first_sibling)
      end

      # print_current_order
      task
    end

    def move_children(children, parent_node)
      ref_node = parent_node
      children.each do |t|
        batch_tasks = get_tasks(parent_node.batch)
        t_with_wbs = get_task(batch_tasks, t.id)
        move_node(t_with_wbs, ref_node)
        ref_node = t_with_wbs
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
      @task_to_move ||= Cultivation::Task.includes(:batch, :users).find_by(id: @task_id)
    end

    def get_task(batch_tasks, task_id)
      batch_tasks.detect { |t| t.id == task_id }
    end

    def get_tasks(batch)
      Cultivation::QueryTasks.call(batch).result
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

    def can_move?
      # Rails.logger.debug "\033[31m indelible: #{task_to_move.indelible? ? "Indelible" : "Not Indelible"} \033[0m"
      if task_to_move.nil?
        errors.add(:error, 'Task Not Found')
        return false
      end
      if task_to_move.indelible?
        errors.add(:error, "Task '#{task_to_move.name}' cannot be moved.")
        return false
      end
      true
    end
  end
end
