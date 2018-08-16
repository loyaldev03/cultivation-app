class Api::V1::TasksController < Api::V1::BaseApiController
  def index
    batch = Cultivation::Batch.find(params[:batch_id])
    if batch.present?
      render json: {data: batch.tasks}
    else
      render json: {data: 'Batch Not Found'}
    end
  end

  def strains
  end
end
