class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'
    plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch).
      where(current_growth_stage: {'$in': growth_stages})
    plants = plants.where(facility_strain_id: params[:facility_strain_id]) if params[:facility_strain_id]
    facility = current_facility || current_default_facility
    facility_strain_ids = facility.strains.pluck(:id).map(&:to_s)
    plants = plants.in(facility_strain_id: facility_strain_ids)
    plants = plants.order(c_at: :desc).to_a

    data = Inventory::PlantSerializer.new(
      plants,
      params: {query: QueryLocations.call(facility.id)},
    ).serialized_json
    render json: data
  end

  def search
    plants = Inventory::SearchPlants.call(
      params[:facility_strain_id],
      params[:current_growth_stage],
      params[:search],
    ).result
    data = Inventory::PlantSerializer.new(
      plants,
      params: {
        exclude: %i(location batch),
      },
    ).serialized_json
    render json: data
  end

  def search_by_location
    facility_id = params[:facility_id]
    strain_id = params[:strain_id]
    location_id = params[:location_id]
    command = Inventory::SearchPlantsByLocation.call(
      facility_id,
      strain_id,
      location_id,
    )
    if command.success?
      plants = command.result.sort_by(&:plant_id)
      render json: plants.as_json
    else
      render json: request_with_errors(command.errors)
    end
  end

  def save_destroyed_plant
    command = Inventory::SaveDestroyedPlant.call(
      current_user,
      batch_id: params[:batch_id],
      plant_id: params[:plant_id],
      destroyed_reason: params[:destroyed_reason],
    )
    if command.success?
      render json: command.result.as_json
    else
      render json: request_with_errors(command.errors)
    end
  end

  def destroyed_plants
    batch_id = params[:batch_id]
    command = Inventory::QueryDestroyedPlants.call(batch_id: batch_id)
    if command.success?
      render json: command.result
    else
      render json: request_with_errors(command.errors)
    end
  end

  def show
    plant = Inventory::Plant.find(params[:id])
    render json: Inventory::PlantSerializer.new(
      plant,
      include_options,
    ).serialized_json
  end

  def setup_mother
    command = Inventory::SetupMother.call(current_user, params[:plant].to_unsafe_h)
    if command.success?
      data = Inventory::PlantSerializer.new(
        command.result,
      ).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_plants
    command = Inventory::SetupPlants.call(current_user, params[:plant].to_unsafe_h)

    if command.success?
      data = Inventory::PlantSerializer.new(
        command.result,
      ).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_harvest_batch
    command = Inventory::SetupHarvestBatch.call(current_user, params[:plant].to_unsafe_h)
    if command.success?
      data = Inventory::HarvestBatchSerializer.new(command.result).serialized_json
      render json: data
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def harvests
    facility_strains_ids = Inventory::FacilityStrain.where(facility_id: params[:facility_id]).pluck(:id)
    batches = Inventory::HarvestBatch.in(facility_strain_id: facility_strains_ids).includes(:cultivation_batch, :facility_strain, :plants).order(c_at: :desc)
    render json: Inventory::HarvestBatchSerializer.new(batches).serialized_json
  end

  def show_harvest
    batch = Inventory::HarvestBatch.find(params[:id])
    render json: Inventory::HarvestBatchSerializer.new(batch, include_options).serialized_json
  end

  def lot_numbers
    batch_id = params[:batch_id]
    lot_numbers = Inventory::Plant.where(cultivation_batch_id: batch_id).pluck(:lot_number).uniq
    render json: {lot_numbers: lot_numbers}, status: 200
  end

  private

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end

  def include_options
    options = {}
    if params[:include]
      include_rels = params[:include].split(',').map { |x| x.strip.to_sym }
      options = {params: {include: include_rels}}
    end
    options
  end
end
