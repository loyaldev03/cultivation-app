class Cultivation::BatchesController < ApplicationController
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

  # def create
  #   @record = Cultivation::BatchForm.new
  #   @record = @record.submit(record_params)
  #   if @record
  #     redirect_to cultivation_batch_path(id: @record.id)
  #   else
  #     render 'new'
  #   end
  # end

  def show
    @batch = Cultivation::Batch.find(params[:id])
    @batch_attributes = {
      id: @batch.id.to_s,
      batch_no: @batch.batch_no.to_s,
      strain: @batch.facility_strain.strain_name,
      batch_source: @batch.batch_source,
      grow_method: @batch.grow_method,
      start_date: @batch.start_date,
      estimated_harvest_date: @batch.estimated_harvest_date,
    }
    # TODO: Use other params
    if params[:step].present?
      # Set the plantType for react BatchPlantSelectionList
      @plant_selection_type = get_plants_selection_type(@batch.batch_source)
      @locations = get_available_locations(@batch, 'Clone')
    end
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

  def get_available_locations(record, phase_type)
    phase_info = get_batch_phase(record, phase_type) # Get start_date and end_date from batch record
    if phase_info.present?
      case record.batch_source
      when 'clones_from_mother'
        filter_args = {facility_id: record.facility_id, purpose: 'clone', exclude_batch_id: record.id}
      when 'clones_purchased'
        # TODO: Change purpose when clones_purchased
        filter_args = {facility_id: record.facility_id, purpose: 'clone', exclude_batch_id: record.id}
      when 'seeds'
        # TODO: Change purpose when seeds
        filter_args = {facility_id: record.facility_id, purpose: 'clone', exclude_batch_id: record.id}
      else
        # return empty array if no phase task found
        return []
      end
      available_trays_cmd = QueryAvailableTrays.call(phase_info.start_date, phase_info.end_date, filter_args)
      if available_trays_cmd.success?
        available_trays_cmd.result
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

  def get_batch_phase(record, phase)
    find_phase_cmd = Cultivation::FindBatchPhase.call(record, phase)
    if find_phase_cmd.success?
      find_phase_cmd.result
    else
      nil
    end
  end

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
