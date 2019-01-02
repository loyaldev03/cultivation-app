class Api::V1::TasksController < Api::V1::BaseApiController
  before_action :set_batch, except: [:update_position]

  def index
    if @batch.present?
      tasks = get_all_tasks
      users = User.active
      task_json = TaskSerializer.new(
        tasks, params: {tasks: tasks, users: users},
      ).serialized_json
      render json: task_json
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def update
    update_cmd = Cultivation::UpdateTask.call(task_params)
    if update_cmd.errors.empty?
      task = Cultivation::Task.find(params[:id])
      tasks = get_all_tasks
      users = User.active
      task_json = TaskSerializer.new(
        task, params: {tasks: tasks, users: users},
      ).serialized_json
      render json: task_json
    else
      data = {errors: update_cmd.errors}
      render json: data
    end
  end

  def update_position
    update_cmd = Cultivation::UpdateTaskPosition.call(
      params[:id],
      params[:target_position_task_id],
      current_user,
    )
    if update_cmd.success?
      render json: {data: {id: update_cmd.result.id.to_s}}
    else
      render json: {errors: update_cmd.errors}
    end
  end

  def update_indent
    indent_cmd = Cultivation::UpdateTaskIndent.call(
      params[:id],            # task.id
      params[:indent_action], # in / out
      current_user,
    )
    if indent_cmd.success?
      render json: {data: {id: indent_cmd.result.id.to_s}}
    else
      render json: {errors: indent_cmd.errors}
    end
  end

  def update_dependency
    destination_task = Cultivation::Task.find(params[:destination_id])
    if destination_task.present?
      source_task = Cultivation::Task.find(params[:source_id])
      start_date = source_task.end_date + 1.days
      end_date = start_date + destination_task.duration.days
      destination_task.update(depend_on: params[:source_id], start_date: start_date, end_date: end_date)
      render json: {data: {id: destination_task.id}}
    else
      render json: {errors: 'Update failed'}
    end
  end

  def create
    task = Cultivation::CreateTask.call(task_params).result
    tasks = get_all_tasks
    users = User.active
    task_json = TaskSerializer.new(task, params: {tasks: tasks, users: users}).serialized_json
    render json: task_json
  end

  def destroy
    delete_cmd = Cultivation::DestroyTask.call(params[:id])
    render json: {errors: delete_cmd.errors}
  end

  private

  def set_batch
    @batch = Cultivation::Batch.includes(:tasks).find_by(id: params[:batch_id])
  end

  def get_all_tasks
    Cultivation::QueryTasks.call(@batch).result
  end

  def task_params
    params.require(:task).permit(:phase,
                                 :task_category,
                                 :name,
                                 :duration,
                                 :days_from_start_date,
                                 :start_date,
                                 :end_date,
                                 :estimated_hours,
                                 :estimated_cost,
                                 :is_phase,
                                 :is_category,
                                 :parent_id,
                                 :depend_on,
                                 :task_type,
                                 :position,
                                 :action,
                                 :task_related_id,
                                 :expected_hours_taken,
                                 :time_taken,
                                 :id,
                                 :batch_id,
                                 assigned_employee: [:label, :value], user_ids: [], task_type: [])
  end
end
