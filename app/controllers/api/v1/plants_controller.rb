class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    plants = if params[:plant_status]
               Inventory::ItemArticle.where(plant_status: params[:plant_status]).order(c_at: :desc)
             else
               Inventory::ItemArticle.all.order(c_at: :desc)
             end

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
