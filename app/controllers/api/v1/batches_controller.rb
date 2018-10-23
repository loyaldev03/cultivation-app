module Api::V1
  class BatchesController < Api::V1::BaseApiController
    def index
      batches = Cultivation::Batch.all.order(c_at: :desc)
      render json: BatchSerializer.new(batches).serialized_json
    end

    def create
      # Rails.logger.debug "\033[35m record_params: #{record_params[:phase_duration].to_s} \033[0m"
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
      command = QueryReadyTrays.call(params[:facility_id])
      if command.success?
        render json: {data: command.result}
      else
        render json: {error: command.errors}
      end
    end

    def search_batch_plans
      faciliy_id = params['facility_id']
      month_str = params['search_month']        # E.g. '10-2018' (Format => MM-YYYY)
      total_duration = params['total_duration'] # E.g. 100

      start_date, end_date = get_search_start_end_date(month_str, total_duration)
      Rails.logger.debug "\033[35m total_duration: #{total_duration} \033[0m"
      Rails.logger.debug "\033[35m start_date: #{start_date} \033[0m"
      Rails.logger.debug "\033[35m end_date: #{end_date} \033[0m"

      command = QueryPlannedTrays.call(start_date, end_date, faciliy_id)

      if command.success?
        render json: TrayLocationSerializer.new(command.result).serialized_json
      else
        render json: {error: command.errors}
      end
    end

    private

    def batch_params
      params[:batch].to_unsafe_h
    end

    def command_errors(unsafe_params, command)
      unsafe_params.merge(errors: command.errors)
    end

    # TODO: Move this logic to the UI
    def get_search_start_end_date(month_str, total_duration)
      date_part = month_str.split('-')
      start_date = Date.new(date_part[1].to_i, date_part[0].to_i, 1)
      end_of_duration = start_date + (total_duration).days
      end_of_month = start_date.end_of_month
      end_date = end_of_duration >= end_of_month ? end_of_duration : end_of_month

      # Note: Add additional 7 days before and after because the
      # calendar UI would include some dates for previous month
      start_date = start_date - 6.days
      end_date = end_date + 6.days
      return start_date, end_date
    end

    def record_params
      params.permit(
        :facility_id,
        :batch_source,
        :facility_strain_id,
        :start_date,
        :grow_method,
        :quantity,
        phase_duration: [
          :clone,
          :veg,
          :veg1,
          :veg2,
          :flower,
          :dry,
          :cure
        ],
      )
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
end
