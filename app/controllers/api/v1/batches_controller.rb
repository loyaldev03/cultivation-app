class Api::V1::BatchesController < Api::V1::BaseApiController
  def index
  end

  def create
    @record = Cultivation::BatchForm.new
    @record = @record.submit(record_params)
    Rails.logger.debug "Record ==> #{@record.inspect}"
    if @record
      batch_json = BatchSerializer.new(@record).serialized_json
      render json: batch_json
      # redirect_to cultivation_batch_path(id: @record.id)
    else
      # render 'new'
    end
  end

  private

  def record_params
    params.require(:batch).permit(:batch_source, :strain, :start_date, facility: {})
  end
end
