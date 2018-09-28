class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    plants = Inventory::Plant.where(current_growth_stage: params[:current_growth_stage]).order(c_at: :desc)
    data = Inventory::PlantSerializer.new(plants).serialized_json
    render json: data
  end

  def setup_mother
    command = Inventory::SetupMother.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::PlantSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_clones
    command = Inventory::SetupClones.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_vegs
    command = Inventory::SetupVegGroup.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_harvest_yield
    command = Inventory::SetupHarvestYield.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  private

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end
end
