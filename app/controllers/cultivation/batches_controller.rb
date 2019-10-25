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

  def dashboard
    @batches = Cultivation::Batch.all.active.map do |b|
      {
        id: b.id.to_s,
        name: b.name,
      }
    end
  end

  def new
    if params[:onboarding_type].present?
      current_user_facilities.each do |f|
        f.update_onboarding('ONBOARDING_SETUP_BATCH')
      end
    end
    @facility_id = current_facility&.id.to_s
    # Cultivation Phases during batch setup depends on the
    # Facility's (room & section) purposes
    @phases = Common::GrowPhase.where(is_active: true).pluck(:name)
    @plant_sources = Constants::PLANT_SOURCE_TYPES.map do |a|
      {
        value: a[:code],
        label: a[:name],
      }
    end

    # If Clone growth phase is not enabled in settings, don't allow
    # user to start batch from Clone
    if !@phases.include? Constants::CONST_CLONE
      @plant_sources = Constants::PLANT_SOURCE_TYPES.
        select { |x| x[:code] == :purchased_plants }.
        map { |a| {value: a[:code], label: a[:name]} }
    end

    @strains = Inventory::QueryFacilityStrains.call(
      selected_facilities_ids,
    ).result
    @facilities = current_user_facilities.map do |a|
      {
        value: a.id.to_s,
        label: "#{a.name} (#{a.code})",
      }
    end
    @grow_methods = Common::GrowMethod.active.all.map do |a|
      {
        value: a[:code].nil? ? a[:name].parameterize.underscore : a[:code],
        label: a[:name],
      }
    end
    @templates = Cultivation::Batch.where(is_template: true).map do |a|
      facility_strain = @strains.detect { |b| b[:label] == a.facility_strain.strain_name }
      batch_source = @plant_sources.detect { |b| b[:value].to_s == a.batch_source }
      {
        value: a.id.to_s,
        label: a.template_name,
        template_name: a.template_name,
        batch_source: batch_source.present? ? batch_source[:value] : nil,
        batch_strain: facility_strain.present? ? facility_strain[:value] : nil,
        batch_grow_method: a.grow_method.to_s,
      }
    end
  end

  def show
    if params[:select_location].present?
      quantity = params[:quantity].blank? ? @batch.quantity : params[:quantity]
      start_date = params[:start_date].blank? ? @batch.start_date : params[:start_date]
      # Default start date to tomorrow if not defined
      start_date ||= Time.current.beginning_of_day + 1.days
      # NOTE: this should only return phases that require bookings
      @phases = Common::QueryAvailableRoomPurpose.call.active_growth_stages
      @batch_info = OpenStruct.new(
        id: @batch.id.to_s,
        batch_name: @batch.name,
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

  # This is METRC IDs tab
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
    # NOTE: this should only return phases that require bookings
    cultivation_phases = Common::QueryAvailableRoomPurpose.call.active_growth_stages
    # Get start_date and end_date from batch
    schedules = Cultivation::QueryBatchPhases.call(batch).booking_schedules
    if schedules.any?
      args = {
        start_date: start_date,
        end_date: batch.estimated_harvest_date,
        facility_ids: [batch.facility_id],
        purpose: cultivation_phases,
        exclude_batch_id: batch.id,
      }
      cmd = QueryAvailableTrays.call(args)
      if cmd.success?
        cmd.result
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
