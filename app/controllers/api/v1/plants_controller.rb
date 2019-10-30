class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    facility = params[:facility_id].split(',').map { |x| x.to_bson_id }
    facility_strain_ids = Inventory::FacilityStrain.in(facility_id: facility).pluck(:id).map(&:to_s)
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'
    excludes = *params[:excludes] || []
    destroyed_plant = params[:destroyed_plant]

    if params[:facility_strain_id].present?
      facility_strain_id = params[:facility_strain_id]
    else
      facility_strain_id = nil
    end

    data = Inventory::QueryPlantsInfo.call({facility_strain_id: params[:facility_strain_id], facility_strain_ids: facility_strain_ids,
                                            locations: QueryLocations.call(facility),
                                            growth_stages: growth_stages,
                                            excludes: excludes,
                                            destroyed_plant: destroyed_plant,
                                            page: params[:page],
                                            limit: params[:limit],
                                            search: params[:search]}).result
    render json: data
  end

  def all_plants_wstrain
    facility = Facility.in(id: params[:facility_id].split(',')).map { |x| x.id.to_s }
    if resource_shared?
      facility_strain_ids = Inventory::FacilityStrain.in(facility_id: current_user_facilities_ids).pluck(:id).map(&:to_s)
    else
      facility_strain_ids = Inventory::FacilityStrain.in(facility_id: facility).pluck(:id).map(&:to_s)
    end
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'
    excludes = *params[:excludes] || []

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
    id = params[:search] || params[:id]
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
      facilities = current_user_facilities_ids
    else
      facilities = params[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    data = Inventory::QueryHarvestBatches.call(facilities,
                                               {page: params[:page],
                                                limit: params[:limit],
                                                search: params[:search]}).result

    render json: data
    # batches = Inventory::HarvestBatch.in(facility_strain_id: facility_strains_ids).includes(:cultivation_batch, :facility_strain, :plants).order(c_at: :desc)
    # render json: Inventory::HarvestBatchSerializer.new(batches).serialized_json
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

  def plant_waste
    facility = Facility.in(id: params[:facility_id].split(',')).map { |x| x.id.to_s }

    if resource_shared?
      facility_strain_ids = Inventory::FacilityStrain.in(facility_id: current_user_facilities_ids).pluck(:id).map(&:to_s)
    else
      facility_strain_ids = Inventory::FacilityStrain.in(facility_id: facility).pluck(:id).map(&:to_s)
    end

    @page = params[:page].to_i
    @limit = params[:limit].to_i
    skip ||= (@page * @limit)

    plants = Inventory::Plant.collection.aggregate([
      match_search,
      {"$match": {"facility_strain_id": {"$in": facility_strain_ids.map { |x| x.to_bson_id }}}},
      {"$match": {"destroyed_date": {"$nin": [nil]}}},
      {"$lookup": {from: 'cultivation_batches',
                   localField: 'cultivation_batch_id',
                   foreignField: '_id',
                   as: 'batch'}},

      {"$unwind": {
        "path": '$batch',
        "preserveNullAndEmptyArrays": true,
      }},

      {"$lookup": {from: 'inventory_harvest_batches',
                   localField: 'harvest_batch_id',
                   foreignField: '_id',
                   as: 'harvest'}},

      {"$unwind": {
        "path": '$harvest',
        "preserveNullAndEmptyArrays": true,
      }},
      {"$lookup": {from: 'inventory_facility_strains',
                   localField: 'facility_strain_id',
                   foreignField: '_id',
                   as: 'strain'}},
      {"$unwind": {
        "path": '$strain',
        "preserveNullAndEmptyArrays": true,
      }},

      {"$lookup": {from: 'trays',
                   localField: 'location_id',
                   foreignField: '_id',
                   as: 'location'}},

      {"$unwind": {
        "path": '$location',
        "preserveNullAndEmptyArrays": true,
      }},

      {"$project": {
        "_id": 0,
        "id": {"$toString": '$_id'},
        "plant_id": 1,
        "batch_id": {"$concat": ['$batch.batch_no', ' - ', '$batch.name']},
        "harvest_id": '$harvest.harverst_name',
        "strain_name": '$strain.strain_name',
        "location_id": 1,
        "location": '$location.full_code',
        "current_growth_stage": 1,
        "planting_date": 1,
        "harvest_date": 1,
        "destroyed_date": 1,
        "destroyed_reason": 1,
        "wet_waste_weight": 1,
        "wet_weight_uom": 1,

      }},
      {"$facet": {
        metadata: [
          {"$count": 'total'},
          {"$addFields": {
            page: @page,
            pages: {"$ceil": {"$divide": ['$total', @limit]}},
            skip: skip,
            limit: @limit,
          }},
        ],
        data: [
          {"$skip": skip},
          {"$limit": @limit},
        ],
      }},
    ])

    result = plants.to_a[0]
    @metadata = result['metadata'][0]

    new_tasks_info = {
      metadata: @metadata,
      data: result[:data],
    }

    # plants = Inventory::Plant.in(facility_strain_id: facility_strain_ids).not_in(destroyed_date: nil)
    # data = Inventory::PlantWasteSerializer.new(
    #   plants,
    #   params: {
    #     locations: QueryLocations.call(facility),
    #   },
    # ).serialized_json
    render json: new_tasks_info
  end

  private

  def match_search
    if params[:search].present?
      {"$match": {"$or": [{"plant_id": Regexp.new(@search, Regexp::IGNORECASE)}, {"plant_tag": Regexp.new(@search, Regexp::IGNORECASE)}]}}
    else
      {"$match": {}}
    end
  end

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end

  def include_options
    options = {}
    if params[:include]
      include_rels = params[:include].split(',').map { |x| x.strip.to_sym }
      options = {params: {include: include_rels}}
    elsif params[:facility_id]
      facility = Facility.in(id: params[:facility_id].split(',')).map { |x| x.id.to_s }
      options = {params: {locations: QueryLocations.call(facility)}}
    end
    options
  end
end
