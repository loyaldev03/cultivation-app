class FacilitySetupController < ApplicationController
  layout 'blank'

  def new
    wizard_form
    render "facility_setup/step#{current_step}"
  end

  def save
    Rails.logger.debug '-----------------current step-----------------------'
    Rails.logger.debug current_step
    Rails.logger.debug '-----------------next step-----------------------'
    Rails.logger.debug next_step
    Rails.logger.debug '----------------------------------------'
    Rails.logger.debug wizard_form_params
    if wizard_form.submit(wizard_form_params)
      # continue to next step or show summary
      redirect_to current_step < 6 ?
                    facility_setup_new_path(facility_id: wizard_form.id, step: next_step) :
                    facility_setup_summary_path(facility_id: wizard_form.id)
    else
      Rails.logger.debug '------------------------------------------------------'
      Rails.logger.debug '--------------- failed to submit ---------------------'
      Rails.logger.debug '------------------------------------------------------'
      Rails.logger.debug wizard_form.errors
      render "facility_setup/step#{current_step}"
    end
  end

  def summary
    wizard_form
  end

  private

  def wizard_form
    case current_step
    when 1
      @wizard_form ||= FacilityBasicInfoForm.new
    when 2
      @wizard_form ||= FacilityRoomCountForm.new(facility)
    when 3
      @wizard_form ||= FacilityRoomsOverviewForm.new(facility)
    when 4
      @wizard_form ||= FacilityRoomSetupForm.new(facility)
    when 5
      @wizard_form ||= FacilitySectionSetupForm.new(facility)
    else
      @wizard_form ||= FacilitySummaryView.new(facility)
    end
  end

  def facility
    @facility ||= Facility.find(params[:facility_id]) if params[:facility_id]
  end

  def current_step
    @current_step ||= params[:step].nil? ? 1 : params[:step].to_i
  end

  def next_step
    @next_step ||= current_step.next
  end

  def wizard_form_params
    case current_step
    when 1
      facility_basic_info_params
    when 2
      facility_room_count_params
    when 3
      facility_room_count_params
    when 4
      facility_room_count_params
    when 5
      facility_room_count_params
    else
      facility_room_count_params
    end
  end

  def facility_basic_info_params
    params.require(:facility).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end

  def facility_room_count_params
    params.require(:facility).permit(:room_count)
  end

  def facility_rooms_overview_params
    params.require(:facility).permit(:room_count)
  end
end
