class Api::V1::TasksController < Api::V1::BaseApiController
  before_action :set_batch, except: [:update]

  def index
    if @batch.present?
      tasks = @batch.tasks.order_by(position: :asc)
      users = User.active
      task_json = TaskSerializer.new(tasks, params: {tasks: tasks, users: users}).serialized_json
      render json: task_json
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def update
    a = Cultivation::UpdateTask.call(task_params)
    if a.errors.empty?
      task = Cultivation::Task.find(params[:id])
      tasks = task.batch.tasks.order_by(position: :asc)
      users = User.active
      task_json = TaskSerializer.new(task, params: {tasks: tasks, users: users}).serialized_json
      render json: task_json
    else
      data = {errors: a.errors}
      render json: data
    end
  end

  def update_position
    update_cmd = Cultivation::UpdateTaskPosition.call(
      params[:id],
      task_params[:position],
      current_user
    )
    if update_cmd.success?
      render json: {data: {id: update_cmd.result.id.to_s}}
    else
      render json: {errors: update_cmd.errors}
    end
  end

  def update_dependency
    task = Cultivation::Task.find(params[:source_id])
    if task.present?
      task.update(depend_on: params[:destination_id])
      render json: {data: {id: task.id}}
    else
      render json: {errors: 'Update failed'}
    end
  end

  def create
    task = Cultivation::CreateTask.call(task_params).result
    tasks = @batch.tasks.order_by(position: :asc)
    users = User.active
    task_json = TaskSerializer.new(task, params: {tasks: tasks, users: users}).serialized_json
    render json: task_json
  end

  def indent
    task = Cultivation::IndentTask.call(task_params).result
    tasks = @batch.tasks.order_by(position: :asc)
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
    @batch = Cultivation::Batch.find(params[:batch_id])
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
