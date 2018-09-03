class Api::V1::PlantSetupsController < Api::V1::BaseApiController
  def create_mother
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)
    Rails.logger.debug ">>>>> Inventory::SetupMother.call: #{command.success?}"

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: {data: data}
    else
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
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
