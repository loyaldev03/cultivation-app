class Api::V1::TasksController < Api::V1::BaseApiController
  before_action :set_batch

  def index
    if @batch.present?
      # tasks_json = batch.tasks.map{|a| TaskSerializer.new(a).serializable_hash}
      # batch_json = BatchSerializer.new(batch).serializable_hash

      tasks = @batch.tasks.order_by(position: :asc)
      options = {}
      options[:is_collection]
      task_json = TaskSerializer.new(tasks, options).serialized_json
      render json: task_json
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def update
    Cultivation::UpdateTask.call(task_params)
    options = {}
    task = Cultivation::Task.find(params[:id])
    task_json = TaskSerializer.new(task, options).serialized_json
    render json: task_json
  end

  def create
    task = Cultivation::CreateTask.call(task_params).result
    options = {}
    task_json = TaskSerializer.new(task, options).serialized_json
    render json: task_json
  end

  def indent
    task = Cultivation::IndentTask.call(task_params).result
    options = {}
    task_json = TaskSerializer.new(task, options).serialized_json
    render json: task_json
  end

  def strains
  end

  private

  def set_batch
    @batch = Cultivation::Batch.find(params[:batch_id])
  end

  def task_params
    params.require(:task).permit(:parent_id, :phase, :task_category, :name, :duration, :action,
                                 :estimated_hours, :assigned_employee, :type, :position,
                                 :task_related_id,
                                 #:expected_end_date, :estimated_hours, :assigned_employee,
                                 :days_from_start_date, :expected_start_date, :start_date, :end_date, :expected_hours_taken,
                                 :time_taken, :no_of_employees, :materials, :instruction, :id, :batch_id)
  end
end
