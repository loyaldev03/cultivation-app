class Api::V1::BatchesController < Api::V1::BaseApiController
  def create
    @record = Cultivation::BatchForm.new
    @record = @record.submit(record_params)
    if @record
      batch_json = BatchSerializer.new(@record).serialized_json
      render json: batch_json
    else
      render json: {error: 'Something wrong'}
    end
  end

  def update_locations
    render json: {locations: locations_params[:locations], batch_id: locations_params[:batch_id]}
  end

  private

  def record_params
    params.require(:batch).permit(:batch_source, :strain_id, :start_date, :grow_method, :facility_id)
  end

  def locations_params
    params.permit(
      :batch_id,
      locations:
      [
        :plant_id,
        :room_id,
        :row_id,
        :shelf_id,
        :tray_id,
        :tray_capacity
      ]
    )
  end
end
