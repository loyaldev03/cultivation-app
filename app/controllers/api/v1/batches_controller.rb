class Api::V1::BatchesController < Api::V1::BaseApiController
  def index
    batches = Cultivation::Batch.all.order(c_at: :desc)
    phases = extract_phases(batches)
    exclude_tasks = params[:exclude_tasks] == 'true' || false
    options = {params: {exclude_tasks: exclude_tasks, phases: phases}}

    render json: BatchSerializer.new(batches, options).serialized_json
  end

  def batch_info
    batch_id = params[:batch_id]
    batch = Cultivation::Batch.includes(:facility_strain).find_by(id: batch_id)
    render json: BatchInfoSerializer.new(batch).serialized_json
  end

  def list_infos
    batches = Cultivation::Batch.includes(:facility_strain).all.order(c_at: :desc)
    render json: BatchInfoSerializer.new(batches).serialized_json
  end

  def create
    args = {
      facility_id: params[:facility_id],
      facility_strain_id: params[:facility_strain_id],
      batch_source: params[:batch_source],
      grow_method: params[:grow_method],
      name: params[:name],
    }
    command = Cultivation::CreateBatch.call(current_user, args)
    if command.success?
      render json: {data: command.result.id.to_s}
    else
      render json: command_errors(args, command), status: 422
    end
  end

  def update_locations
    batch_id = params[:batch_id]
    plans = params[:plans]
    quantity = params[:quantity]
    save_cmd = Cultivation::SaveTrayPlans.call(batch_id, plans, quantity)
    if save_cmd.success?
      render json: {data: 'Ok'}
    else
      render json: command_errors({}, save_cmd), status: 422
    end
  end

  def update_batch
    if params[:action_type] == 'activate'
      update_cmd = Cultivation::UpdateBatchScheduled.call(
        current_user,
        batch_id: params[:batch_id],
        start_date: params[:start_date],
      )
      if update_cmd.success?
        render json: {data: 'Ok'}
      else
        render json: command_errors({}, update_cmd), status: 422
      end
    else
      render json: {errors: "Invalid params actionType: #{params[:actionType]}"}
    end
  end

  def update_batch_info
    args = {
      name: params[:name],
      selected_plants: params[:selected_plants],
    }
    update_cmd = Cultivation::UpdateBatchInfo.call(
      current_user,
      params[:batch_id],
      args
    )
    if update_cmd.success?
      render json: {data: 'Ok'}
    else
      render json: command_errors({}, update_cmd), status: 422
    end
  end

  def setup_simple_batch
    command = Cultivation::SetupSimpleBatch.call(current_user, batch_params)
    if command.success?
      phases = extract_phases(command.result)
      options = {params: {phases: phases, exclude_tasks: true}}
      render json: BatchSerializer.new(command.result, options).serialized_json
    else
      render json: command_errors(batch_params, command), status: 422
    end
  end

  def search_locations
    # Rails.logger.debug "\033[34m Faclity ID: #{params[:facility_id]} \033[0m"
    command = QueryReadyTrays.call(params[:facility_id], params[:purpose])
    if command.success?
      render json: {data: command.result}
    else
      render json: {error: command.errors}
    end
  end

  def search_batch_plans
    faciliy_id = params['facility_id']
    exclude_batch_id = params['exclude_batch_id']
    month_str = params['search_month']        # E.g. '10-2018' (Format => MM-YYYY)
    total_duration = params['total_duration'] # E.g. 100
    start_date, end_date = get_search_start_end_date(month_str, total_duration)
    # Rails.logger.debug "\033[35m total_duration: #{total_duration} \033[0m"
    # Rails.logger.debug "\033[35m exclude_batch_id: #{exclude_batch_id} \033[0m"
    # Rails.logger.debug "\033[35m start_date: #{start_date} \033[0m"
    # Rails.logger.debug "\033[35m end_date: #{end_date} \033[0m"
    command = QueryPlannedTrays.call(start_date, end_date, faciliy_id, exclude_batch_id)
    if command.success?
      render json: TrayLocationSerializer.new(command.result).serialized_json
    else
      render json: {error: command.errors}
    end
  end

  def destroy
    command = Cultivation::DestroyBatch.call(current_user, params[:id])
    if command.success?
      render json: {data: command.result}
    else
      render json: {error: command.errors}
    end
  end

  def plants_movement_history
    command = Cultivation::QueryPlantsMovement.call(current_user,
                                                    batch_id: params[:batch_id],
                                                    phase: params[:phase],
                                                    activity: params[:activity],
                                                    selected_plants: params[:selected_plants])
    if command.success?
      render json: PlantsMovementsSerializer.new(command.result).serialized_json
    else
      render json: {error: command.errors}
    end
  end

  def update_plants_movement
    command = Cultivation::SavePlantMovement.call(
      current_user,
      batch_id: params[:batch_id],
      task_id: params[:task_id],
      mother_plant_id: params[:mother_plant_id],
      mother_plant_code: params[:mother_plant_code],
      destination_id: params[:destination_id],
      destination_type: params[:destination_type],
      destination_code: params[:destination_code],
      plants: params[:plants],
    )

    if command.success?
      render json: {data: 'OK'}
    else
      render json: {error: command.errors}
    end
  end

  private

  def extract_phases(batches)
    batch_array = batches.to_a
    phases = Cultivation::Task.where(
      batch_id: {:$in => batch_array.pluck(:id)},
      indent: 0,
      phase: {:$in => [
        Constants::CONST_CLONE, Constants::CONST_VEG, Constants::CONST_VEG1, Constants::CONST_VEG2,
        Constants::CONST_FLOWER, Constants::CONST_DRY, Constants::CONST_CURE,
      ]},
    ).map { |task| ["#{task.batch_id.to_s}/#{task.phase}", task] }.to_h
    phases
  end

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
end
