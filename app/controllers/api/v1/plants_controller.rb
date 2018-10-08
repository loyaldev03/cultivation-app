class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch)
                             .where(current_growth_stage: params[:current_growth_stage])
                             .order(c_at: :desc)

    data = Inventory::PlantSerializer.new(plants).serialized_json
    render json: data
  end

  def search
    plants = Inventory::Plant.includes(:facility_strain)
                             .where(current_growth_stage: params[:current_growth_stage])

    if params[:facility_strain_id].blank?
      plants = []
    else
      plants = plants.where(facility_strain_id: params[:facility_strain_id])

      unless params[:search].blank?
        search = params[:search]
        plants = plants.where(plant_id: /^#{search}/i)
      end

      plants = plants.limit(7)
    end

    options = {params: {exclude: [:location, :batch]}}
    data = Inventory::PlantSerializer.new(plants, options).serialized_json
    render json: data
  end

  def show
    plant = Inventory::Plant.find(params[:id])
    render json: Inventory::PlantSerializer.new(plant).serialized_json
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
    command = Inventory::SetupClones.call(current_user, params[:growth_stage], params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::PlantSerializer.new(command.result).serialized_json
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
