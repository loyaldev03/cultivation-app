class Cultivation::BatchesController < ApplicationController
  authorize_resource class: false
  before_action :find_batch_info, only: [:show,
                                         :gantt,
                                         :locations,
                                         :issues,
                                         :secret_sauce,
                                         :resource,
                                         :material]

  def index
    @dashboard = DashboardForm::DashboardForm.new
  end

  def new
    if params[:onboarding_type].present?
      current_facility.update_onboarding('ONBOARDING_SETUP_BATCH')
    end
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
    @grow_methods = Common::GrowMethod.active.all.map do |a|
      {
        value: a[:code],
        label: a[:name],
      }
    end
  end

  def show
    if params[:select_location].present?
      quantity = params[:quantity].blank? ? @batch.quantity : params[:quantity]
      start_date = params[:start_date].blank? ? @batch.start_date : params[:start_date]
      @batch_info = OpenStruct.new(
        id: @batch.id.to_s,
        batchSource: @batch.batch_source,
        cloneSelectionType: get_plants_selection_type(@batch.batch_source),
        quantity: quantity,
        startDate: start_date,
        strainDisplayName: "#{@batch.facility_strain.strain_name} (#{@batch.facility_strain.strain_type})",
        strainId: @batch.facility_strain_id.to_s,
        harvestDate: @batch.estimated_harvest_date,
      ).marshal_dump
      # Set the plantType for react BatchPlantSelectionList
      @locations = get_cultivation_locations(@batch, start_date)
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
    @unresolvedIssueCount = Issues::Issue.where(
      status: {:$ne => 'resolved'},
      is_archived: false,
      cultivation_batch: @batch.id,
    ).count
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

  def get_cultivation_locations(batch, start_date)
    # Get phases from Facility
    cultivation_phases = batch.facility_strain.facility.growth_stages
    # Get start_date and end_date from batch
    schedules = Cultivation::QueryBatchPhases.call(batch).booking_schedules
    if schedules.any?
      available_trays_cmd = QueryAvailableTrays.call(
        start_date: start_date,
        end_date: batch.estimated_harvest_date,
        facility_id: batch.facility_id,
        purpose: cultivation_phases,
        exclude_batch_id: batch.id,
      )
      if available_trays_cmd.success?
        available_trays_cmd.result
      else
        []
      end
    end
  end

  def find_batch_info
    @batch = Cultivation::Batch.includes(:facility_strain).find(params[:id])

    @batch_attributes = Cultivation::FindBatchInfo.call(params[:id]).result
  end

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
