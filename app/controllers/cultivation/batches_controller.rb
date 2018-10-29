class Cultivation::BatchesController < ApplicationController
  before_action :find_batch_info, only: [:show, :gantt, :locations, :issues, :secret_sauce, :resource]

  def index
  end

  def new
    Rails.logger.debug "\033[34m Default Facility: #{current_default_facility&.name} \033[0m"
    @default_facility = current_default_facility&.id&.to_s
    @plant_sources = Constants::PLANT_SOURCE_TYPES.map { |a| {value: a[:code], label: a[:name]} }
    @strains = Inventory::FacilityStrain.all.map { |a| {value: a.id.to_s, label: "#{a.strain_name} (#{a.strain_type})"} }
    @facilities = QueryUserFacilities.call(current_user).result.map { |a| {value: a.id.to_s, label: "#{a.name} (#{a.code})"} }
    @grow_methods = Constants::GROW_MEDIUM.map { |a| {value: a[:code], label: a[:name]} }
  end

  def show
    # TODO: Use other params
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

  private

  def get_plants_selection_type(batch_source)
    case batch_source
    when 'clones_from_mother'
      'mother'
    when 'clones_purchased'
      'clone'
    when 'seeds'
      'seed'
    else
      nil
    end
  end

  def get_cultivation_locations(batch)
    cultivation_phases = [
      Constants::CONST_CLONE,
      Constants::CONST_VEG,
      Constants::CONST_VEG1,
      Constants::CONST_VEG2,
      Constants::CONST_FLOWER,
      Constants::CONST_DRY,
      Constants::CONST_CURE,
    ]
    phases_info = get_batch_phase(batch, cultivation_phases) # Get start_date and end_date from batch
    if phases_info.any?
      filter_args = {facility_id: batch.facility_id, purpose: cultivation_phases, exclude_batch_id: batch.id}
      Rails.logger.debug "\033[34m get_cultivation_locations > batch start_date: #{batch&.start_date} \033[0m"
      Rails.logger.debug "\033[34m get_cultivation_locations > batch estimated_harvest_date: #{batch&.estimated_harvest_date} \033[0m"
      available_trays_cmd = QueryAvailableTrays.call(batch.start_date, batch.estimated_harvest_date, filter_args)
      if available_trays_cmd.success?
        available_trays_cmd.result #&.select { |t| cultivation_phases.include? t.tray_purpose }
      else
        []
      end
    end
  end

  def update
    if params[:type] == 'active'
      @batch = Cultivation::Batch.find(params[:id])
      @batch.update(is_active: true)
      flash[:notice] = 'Batch successfully updated to active'
      redirect_to root_path
    end
  end

  private

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
      strain: @batch.facility_strain.strain_name,
      batch_source: @batch.batch_source,
      grow_method: @batch.grow_method,
      start_date: @batch.start_date,
      estimated_harvest_date: @batch.estimated_harvest_date,
      nutrient_profile: @batch.nutrient_profile,
      total_estimated_hour: @batch.total_estimated_hours,
      total_estimated_cost: @batch.total_estimated_costs,
    }
  end

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
