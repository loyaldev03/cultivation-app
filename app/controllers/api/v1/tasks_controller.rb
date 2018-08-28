class Api::V1::TasksController < Api::V1::BaseApiController
  def index
    batch = Cultivation::Batch.find(params[:batch_id])
    if batch.present?
      # tasks_json = batch.tasks.map{|a| TaskSerializer.new(a).serializable_hash}
      # batch_json = BatchSerializer.new(batch).serializable_hash

      tasks = batch.tasks
      options = {}
      options[:is_collection]
      task_json = TaskSerializer.new(tasks, options).serialized_json
      render json: task_json
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def update
    batch = Cultivation::Batch.find(params[:batch_id])
    task = batch.tasks.find_by(id: params[:id])
    task.update(task_params)
    options = {}
    task_json = TaskSerializer.new(task, options).serialized_json
    render json: task_json
  end

  def strains
  end

  private

  def task_params
    params.require(:task).permit(:batch_id, :phase, :task_category, :name, :days, 
      #:expected_end_date, :estimated_hours, :assigned_employee,
      :days_from_start_date, :expected_start_date, :start_date, :end_date, :expected_hours_taken,
      :time_taken, :no_of_employees, :materials, :instruction)
  end

end