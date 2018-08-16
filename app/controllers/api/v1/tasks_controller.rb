class Api::V1::TasksController < Api::V1::BaseApiController
  def index
    batch = Cultivation::Batch.find(params[:batch_id])
    if batch.present?
      tasks_json = batch.tasks.map{|a| TaskSerializer.new(a).serializable_hash}
      batch_json = BatchSerializer.new(batch).serializable_hash

      tasks = batch.tasks
      options = {}
      options[:is_collection]
      task_json = TaskSerializer.new(tasks, options).serialized_json
      render json: task_json
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def strains
  end
end