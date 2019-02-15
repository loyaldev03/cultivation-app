module Cultivation
  class DestroyTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(current_user, task_id)
      if task_id.nil?
        raise 'Invalid Task id'
      else
        @task_id = task_id
      end
      @current_user = current_user
    end

    # TODO : need to add workday check
    def call
      task = Cultivation::Task.includes(:batch, :issues).find(@task_id)
      batch_tasks = Cultivation::QueryTasks.call(task.batch).result
      task = batch_tasks.detect { |t| t.id == task.id }
      if task.indelible?
        errors.add(:id, "Special task \"#{task.name}\" cannot be deleted.")
        false
      elsif task.children(batch_tasks).present?
        errors.add(:id, 'Task with sub-tasks cannot be deleted.')
        false
      elsif task.dependents(batch_tasks).present?
        errors.add(:id, 'There are other task are depends on this task.')
        false
      elsif task.issues.present?
        errors.add(:id, 'Task with issues cannot be deleted.')
        false
      elsif task.user_ids.present?
        errors.add(:id, 'Task with assigned resouces cannot be deleted.')
        false
      elsif task.material_use.present?
        errors.add(:id, 'This with assigned materials cannot be deleted')
        false
      elsif task
        parent = task.parent(batch_tasks)
        task.delete
        # Call update on parent task to cascade duration changes.
        Cultivation::UpdateTask.call(@current_user, parent)
        @task_id
      else
        false
      end
    end
  end
end
