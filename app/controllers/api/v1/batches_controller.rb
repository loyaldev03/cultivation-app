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
    Rails.logger.debug '>>>1'
    Rails.logger.debug '>>>'
    Rails.logger.debug '>>> update_locations <<<'
    batch_id = locations_params[:batch_id]
    locations = locations_params[:locations]
    save_cmd = Cultivation::SaveTrayPlans.call(batch_id, locations)
    if save_cmd.success?
      render json: {data: 'Ok'}
    else
      Rails.logger.debug '>>>2'
      Rails.logger.debug '>>>'
      Rails.logger.debug save_cmd.errors
      render json: {error: 'Error saving tray plans'}
    end
  end

  private

  def record_params
    params.require(:batch).permit(:batch_source, :strain_id, :start_date, :grow_method, :facility_id)
  end

  def locations_params
    params.permit(
      :batch_id,
      locations: [
        :plant_id,
        :room_id,
        :row_id,
        :shelf_id,
        :tray_id,
        :tray_code,
        :tray_capacity,
      ],
    )
  end
end
