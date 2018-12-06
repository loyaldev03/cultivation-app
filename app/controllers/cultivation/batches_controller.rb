class Cultivation::BatchesController < ApplicationController
  before_action :find_batch_info, only: [:show,
                                         :gantt,
                                         :locations,
                                         :issues,
                                         :secret_sauce,
                                         :resource,
                                         :material]

  def index
  end

  def new
    @facility_id = current_facility&.id.to_s
    # Cultivation Phases during batch setup depends on the
    # Facility's (room & section) purposes
    @phases = current_facility&.purposes || []
    @plant_sources = Constants::PLANT_SOURCE_TYPES.map do |a|
      {
        value: a[:code],
        label: a[:name],
      }
    end
    facility_strains = Inventory::QueryFacilityStrains.call(@facility_id).result
    @strains = facility_strains.map do |a|
      {
        value: a[:value],
        label: a[:strain_name],
      }
    end
    @facilities = QueryUserFacilities.call(current_user).result.map do |a|
      {
        value: a.id.to_s,
        label: "#{a.name} (#{a.code})",
      }
    end
    @grow_methods = Constants::GROW_MEDIUM.map do |a|
      {
        value: a[:code],
        label: a[:name],
      }
    end
  end

  def show
    if params[:select_location].present?
      @batch_info = OpenStruct.new({
        id: @batch.id.to_s,
        batchSource: @batch.batch_source,
        cloneSelectionType: get_plants_selection_type(@batch.batch_source),
        quantity: @batch.quantity,
        startDate: @batch.start_date,
        strainDisplayName: "#{@batch.facility_strain.strain_name} (#{@batch.facility_strain.strain_type})",
        harvestDate: @batch.estimated_harvest_date,
      }).marshal_dump
      # Set the plantType for react BatchPlantSelectionList
      @locations = get_cultivation_locations(@batch)
    end
  end

  def gantt
  end

  def locations
  end

  def issues
  end

  def secret_sauce
  end

  def resource
  end

  def material
  end

  def update
    if params[:type] == 'active'
      @batch = Cultivation::Batch.find(params[:id])
      @batch.update(is_active: true)
      flash[:notice] = 'Batch saved successfully.'
      redirect_to root_path
    end
  end

  def destroy
    Cultivation::DestroyBatch.call(params[:id])
    flash[:notice] = 'Batch deleted.'
    redirect_to dashboard_path
  end

  private

  def get_plants_selection_type(batch_source)
    case batch_source
    when 'clones_from_mother'
      'mother'
    when 'clones_purchased'
      'clone'
    when 'seeds'
      'seed'
    end
  end

  def get_cultivation_locations(batch)
    # Get phases from Facility
    cultivation_phases = batch&.facility_strain&.facility&.growth_stages,
    # Get start_date and end_date from batch
    phases_info = get_batch_phase(batch, cultivation_phases)
    if phases_info.any?
      filter_args = {facility_id: batch.facility_id,
                     purpose: cultivation_phases,
                     exclude_batch_id: batch.id}
      available_trays_cmd = QueryAvailableTrays.call(batch.start_date,
                                                     batch.estimated_harvest_date,
                                                     filter_args)
      if available_trays_cmd.success?
        available_trays_cmd.result
      else
        []
      end
    end
  end

  def get_batch_phase(batch, phases)
    find_phase_cmd = Cultivation::QueryBatchPhases.call(batch, phases)
    if find_phase_cmd.success?
      find_phase_cmd.result
    else
      []
    end
  end

  def find_batch_info
    @batch = Cultivation::Batch.includes(:facility_strain).find(params[:id])

    @batch_attributes = {
      id: @batch.id.to_s,
      batch_no: @batch.batch_no.to_s,
      facility_id: @batch.facility_id.to_s,
      strain: @batch.facility_strain.strain_name,
      batch_source: @batch.batch_source,
      grow_method: @batch.grow_method,
      start_date: @batch.start_date,
      estimated_harvest_date: @batch.estimated_harvest_date,
      nutrient_profile: @batch.nutrient_profile,
      total_estimated_hour: @batch.total_estimated_hours,
      total_estimated_cost: ActionController::Base.helpers.number_to_currency(@batch.total_estimated_costs, unit: '$'),
      materials: @batch.material_summary,
      cultivation_phases: @batch&.facility_strain&.facility&.growth_stages,
      is_active: @batch.is_active,
    }
  end

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
