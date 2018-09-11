class Api::V1::PlantSetupsController < Api::V1::BaseApiController
  def setup_mother
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)
    Rails.logger.debug('>>>>> PlantSetupsController#setup_mother')
    Rails.logger.debug(command.result)
    Rails.logger.debug(command.errors)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: {data: data}
    else
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
    end
  end

  def setup_clones
    command = Inventory::SetupClones.call(current_user, params[:plant_setup].to_unsafe_h)
    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      # TODO: Try rewrite to
      # render json: data
      render json: {data: data}
    else
      # TODO: Try rewrite to
      # render json: params[:plant_setup].merge(errors: command.errors)
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
    end
  end

  def setup_vegs
    command = Inventory::SetupVegGroup.call(current_user, params[:plant_setup].to_unsafe_h)
    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: {data: data}
    else
      render json: {data: params[:plant_setup].to_unsafe_h, errors: command.errors}, status: 422
    end
  end

  def setup_harvest_yield
  end

  def setup_waste
  end
end
