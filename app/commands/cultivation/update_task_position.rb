module Cultivation
  class UpdateTaskPosition
    prepend SimpleCommand

    def initialize(task_id, drop_on_id, current_user)
      @task_id = task_id&.to_bson_id
      @drop_on_id = drop_on_id&.to_bson_id
      @current_user = current_user
    end

    def call
      if valid_params? && can_move?
        tasks = get_tasks(task_to_move.batch)
        @task_to_move = get_task(tasks, @task_id)
        drop_on = get_task(tasks, @drop_on_id)
        move_node(task_to_move, drop_on)

        children = get_children(tasks, task_to_move.wbs)
        move_children(children, task_to_move)
        task_to_move
      end
    end

    private

    def move_node(task, drop_on)
      # pp "Moving #{task.name} -> #{drop_on.name} | #{drop_on.position}"
      if task.indent > drop_on.indent
        # pp '       drop as child node:'
        task.indent = drop_on.indent + 1
        task.parent_id = drop_on.id
        new_position = get_new_position(task.position, drop_on.position)
      else
        tasks = get_tasks(drop_on.batch)
        drop_on = get_task(tasks, drop_on.id)
        drop_on_children = get_children(tasks, drop_on.wbs)
        if drop_on_children&.any?
          # pp '       drop on tree parent'
          new_position = get_new_position(task.position,
                                          drop_on_children.last.position)
        else
          # pp '       drop on sibling node'
          new_position = get_new_position(task.position, drop_on.position)
        end
      end
      # print_current_order
      task.move_to! new_position
      # print_current_order
      task
    end

    def move_children(children, parent_node)
      ref_node = parent_node
      children.each do |t|
        t = Cultivation::Task.find(t.id)
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
    end

    def get_children(batch_tasks, task_wbs)
      WbsTree.children(batch_tasks, task_wbs)
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
      if task_to_move.nil?
        errors.add(:error, 'Task Not Found')
        return false
      end
      if task_to_move.indelible
        errors.add(:error, "Task '#{task_to_move.name}' cannot be moved.")
        return false
      end
      true
    end
  end
end
