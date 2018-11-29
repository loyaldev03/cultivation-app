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
      Rails.logger.debug "errors ===> #{a.errors}"
      data = {errors: a.errors}
      render json: data
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

  def strains
  end

  def destroy
    result = Cultivation::DestroyTask.call(params[:id]).result
    render json: {result: result}
  end

  private

  def set_batch
    @batch = Cultivation::Batch.find(params[:batch_id])
  end

  def task_params
    params.require(:task).permit(:parent_id, :phase, :task_category, :name, :duration, :action,
                                 :estimated_hours, :type, :position,
                                 :task_related_id,
                                 :days_from_start_date, :start_date, :end_date, :expected_hours_taken,
                                 :time_taken, :id, :batch_id,
                                 assigned_employee: [:label, :value], user_ids: [], task_type: [])
  end
end
