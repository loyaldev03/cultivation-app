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

  def search_locations
    command = QueryReadyTrays.call(params[:facility_id], 'clone')
    if command.success?
      render json: {data: command.result}
    else
      render json: {error: command.errors}
    end
  end

  def search_tray_plans
    month_str = params['search_month'] # E.g. '10-2018' (Format => MM-YYYY)
    if month_str.present? && month_str.length >= 6 && month_str.index('-') >= 1
      plan_start_date, plan_end_date = get_start_end_for_month(month_str)
      Rails.logger.debug "\033[31m plan_start_date: #{plan_start_date} \033[0m"
      Rails.logger.debug "\033[31m plan_start_date: #{plan_end_date} \033[0m"
      command = QueryPlannedTrays.call(
        plan_start_date,
        plan_end_date,
        params[:facility_id]
      )
      if command.success?
        render json: TrayLocationSerializer.new(command.result).serialized_json
      else
        render json: {error: command.errors}
      end
    else
      render json: {error: 'Invalid Search Month'}
    end
  end

  private

  def batch_params
    params[:batch].to_unsafe_h
  end

  def command_errors(unsafe_params, command)
    unsafe_params.merge(errors: command.errors)
  end

  def get_start_end_for_month(month_str)
    date_part = month_str.split('-')
    start_date = Date.new(date_part[1].to_i, date_part[0].to_i, 1)
    end_date = start_date.end_of_month
    # Add additional 7 days before and after because the
    # calendar might include some dates for previous month
    start_date = start_date - 7.days
    end_date = end_date + 7.days
    return start_date, end_date
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
