class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    facility = Facility.in(id: params[:facility_id].split(',')).map { |x| x.id.to_s }
    if resource_shared?
      facility_strain_ids = Inventory::FacilityStrain.all.pluck(:id).map(&:to_s)
    else
      facility_strain_ids = Inventory::FacilityStrain.in(facility_id: facility).pluck(:id).map(&:to_s)
    end
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'
    excludes = params[:excludes] || []
    plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch)
    plants = plants.where(current_growth_stage: {'$in': growth_stages}) if growth_stages.any?
    plants = plants.not_in(current_growth_stage: excludes) if excludes&.any?
    plants = plants.where(facility_strain_id: params[:facility_strain_id]) if params[:facility_strain_id]
    plants = plants.in(facility_strain_id: facility_strain_ids)
    plants = plants.order(c_at: :desc).to_a
    data = Inventory::PlantSerializer.new(
      plants,
      params: {
        locations: QueryLocations.call(facility),
      },
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
      plant_tag: params[:plant_tag],
      destroyed_reason: params[:destroyed_reason],
    )
    if command.success?
      render json: command.result.as_json
    else
      render json: request_with_errors(command.errors)
    end
  end

  def all_destroyed_plant
    destroyed_plants = Inventory::Plant.not.where(destroyed_date: nil)
    render json: Inventory::PlantSerializer.new(destroyed_plants, include_options).serialized_json
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

  def show_by_plant_tag
    plant = Inventory::Plant.find_by(plant_tag: params['plant_tag'])
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
    if resource_shared?
      facility_strains_ids = Inventory::FacilityStrain.all.pluck(:id)
    else
      facility_strains_ids = Inventory::FacilityStrain.where(facility_id: params[:facility_id]).pluck(:id)
    end

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

  def resource_shared?
    CompanyInfo.last.enable_resouces_sharing
  end
end
