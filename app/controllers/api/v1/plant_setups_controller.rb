class Api::V1::PlantSetupsController < Api::V1::BaseApiController
  def setup_mother
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)
    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: {data: data}
    else
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
    end
  end

  def setup_clone
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)
    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: {data: data}
    else
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
    end
  end

  def setup_veg
  end

  def setup_harvest_yield
  end

  def setup_waste
  end
end
