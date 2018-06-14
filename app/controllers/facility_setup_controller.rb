class FacilitySetupController < ApplicationController
  layout 'blank'

  def new
    @facility = current_step == 1 ? FacilityBasicInfoForm.new : Facility.find(params[:facility_id])
    render "facility_setup/step#{@current_step}"
  end

  def save
    # facility_setup_form_params = params[:facility]
    # Rails.logger.debug "======="
    # Rails.logger.debug facility_basic_info_params
    # Rails.logger.debug "======="
    if current_step == 1
      @facility = FacilityBasicInfoForm.new
    else
      @facility = Facility.find(params[:facility_id])
    end

    if @facility.submit(facility_basic_info_params)
      # continue to next step or show summary
      redirect_to current_step != '6' ?
          facility_setup_new_path(facility_id: @facility.id, step: next_step) :
          facility_setup_summary_path(facility_id: @facility.id)
    else
      render "facility_setup/step#{current_step}"
    end
  end

  def summary
    @facility = Facility.find(params[:facility_id])
  end

  private

  def wizard_form
    case current_step
    when 1
      @wizard_form ||= FacilityBasicInfoForm.new
    when 2
      @wizard_form ||= FacilityRoomCountForm.new
    when 3
      @wizard_form ||= FacilityRoomsOverviewForm.new
    when 4
      @wizard_form ||= FacilityRoomSetupForm.new
    when 5
      @wizard_form ||= FacilitySectionSetupForm.new
    else
      @wizard_form ||= FacilitySummaryView.new
    end
  end

  def current_step
    @current_step ||= params['step'] || 1
  end

  def next_step
    @next_step ||= current_step.next
  end

  def facility_basic_info_params
    params.require(:facility).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end
