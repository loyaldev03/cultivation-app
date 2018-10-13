class Api::V1::BatchesController < Api::V1::BaseApiController
  def index
    batches = Cultivation::Batch.all.order(c_at: :desc)
    render json: BatchSerializer.new(batches).serialized_json
  end

  def create
    command = Cultivation::CreateBatch.call(current_user, record_params)
    if command.success?
      render json: BatchSerializer.new(command.result).serialized_json
    else
      render json: command_errors(record_params, command), status: 422
    end
  end

  def update_locations
    batch_id = locations_params[:batch_id]
    locations = locations_params[:locations]
    save_cmd = Cultivation::SaveTrayPlans.call(batch_id, locations)
    if save_cmd.success?
      render json: {data: 'Ok'}
    else
      render json: command_errors(batch_params, save_cmd), status: 422
    end
  end

  def setup_simple_batch
    command = Cultivation::SetupSimpleBatch.call(current_user, batch_params)
    if command.success?
      render json: BatchSerializer.new(command.result).serialized_json
    else
      render json: command_errors(batch_params, command), status: 422
    end
  end

  private

  def batch_params
    params[:batch].to_unsafe_h
  end

  def command_errors(unsafe_params, command)
    unsafe_params.merge(errors: command.errors)
  end

  def record_params
    params.require(:batch).permit(:batch_source, :facility_strain_id, :start_date, :grow_method)
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
