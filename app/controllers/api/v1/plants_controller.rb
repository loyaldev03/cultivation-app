class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'

    plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch)
                             .where(current_growth_stage: {'$in': growth_stages})
                             .order(c_at: :desc)

    data = Inventory::PlantSerializer.new(plants).serialized_json
    render json: data
  end

  def search
    plants = Inventory::SearchPlants.call(
      params[:facility_strain_id],
      params[:current_growth_stage],
      params[:search]
    ).result

    options = {params: {exclude: [:location, :batch]}}
    data = Inventory::PlantSerializer.new(plants, options).serialized_json
    render json: data
  end

  def show
    plant = Inventory::Plant.find(params[:id])
    options = {}

    if params[:include]
      include_rels = params[:include].split(',').map { |x| x.strip.to_sym }
      options = {params: {include: include_rels}}
    end

    render json: Inventory::PlantSerializer.new(plant, options).serialized_json
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

  def setup_plants
    command = Inventory::SetupPlants.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::PlantSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_harvest_yield
    # TODO: To be completed
    command = Inventory::SetupHarvestYield.call(current_user, params[:plant].to_unsafe_h)
    render json: []
  end

  private

  # def plants_params
  #   params[:plant].to_unsafe_h
  # end

  # command_errors(plant_params, command)

  # def command_errors(plant_params, command)
  #   plant_params.merge(errors: command.errors)
  # end

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end
end
