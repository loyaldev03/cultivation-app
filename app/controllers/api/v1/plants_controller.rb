class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    plants = Inventory::ItemArticle.includes(:facility, :item)

    if params[:plant_status]
      plants = plants.where(plant_status: params[:plant_status])
    end

    if params[:strain_id]
      plants = plants.where(strain_id: params[:strain_id])
    end

    plants = plants.order(c_at: :desc)
    data = Inventory::ItemArticleSerializer.new(plants).serialized_json
    render json: data
  end

  def setup_mother
    command = Inventory::SetupMother.call(current_user, params[:plant_setup].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_clones
    command = Inventory::SetupClones.call(current_user, params[:plant_setup].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_vegs
    command = Inventory::SetupVegGroup.call(current_user, params[:plant_setup].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_harvest_yield
    command = Inventory::SetupHarvestYield.call(current_user, params[:plant_setup].to_unsafe_h)

    if command.success?
      data = Inventory::ItemArticleSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  private

  def request_with_errors(errors)
    params[:plant_setup].to_unsafe_h.merge(errors: errors)
  end
end
