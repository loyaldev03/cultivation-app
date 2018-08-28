class Api::V1::PlantSetupsController < Api::V1::BaseApiController
  def create_mother
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)
    Rails.logger.debug ">>>>> Inventory::SetupMother.call: #{command.success?}"

    if command.success?
      render json: {data: 'ok'}
    else
      render json: {data: 'not ok', errors: command.result}, status: 400
    end
  end

  def create_clone
  end

  def create_veg
  end

  def create_harvest_yield
  end

  def create_waste
  end
end
