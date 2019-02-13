class Api::V1::PlantsController < Api::V1::BaseApiController
  def all
    growth_stages = *params[:current_growth_stage] # convert to array
    growth_stages = %w(veg veg1 veg2) if params[:current_growth_stage] == 'veg'
    plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch)
                             .where(current_growth_stage: {'$in': growth_stages})
    plants = plants.where(facility_strain_id: params[:facility_strain_id]) if params[:facility_strain_id]
    plants = plants.order(c_at: :desc)

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
    render json: Inventory::PlantSerializer.new(plant, include_options).serialized_json
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
    batches = Inventory::HarvestBatch.includes(:cultivation_batch, :facility_strain, :plants).all.order(c_at: :desc)
    render json: Inventory::HarvestBatchSerializer.new(batches).serialized_json
  end

  def show_harvest
    batch = Inventory::HarvestBatch.find(params[:id])
    render json: Inventory::HarvestBatchSerializer.new(batch, include_options).serialized_json
  end

  def lot_numbers
    lot_numbers = Inventory::Plant.where(batch_id: '').pluck(:lot_no).uniq
    render json: {lot_numbers: lot_numbers}, status: 200
  end

  #
  def manicure_batch
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
