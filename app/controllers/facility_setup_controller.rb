class FacilitySetupController < ApplicationController
  layout 'blank'

  def new
    wizard_form
    render "facility_setup/step#{current_step}"
  end

  def save
    if wizard_form.submit(wizard_form_params)
      # continue to next step or show summary
      if current_step == 3
        redirect_to facility_setup_new_path(step: next_step,
                                            facility_id: wizard_form.facility_id,
                                            room_id: wizard_form.room_id)
      elsif current_step == 4
        redirect_to facility_setup_new_path(step: next_step,
                                            facility_id: wizard_form.facility_id,
                                            room_id: wizard_form.room_id,
                                            section_id: wizard_form.section_id)
      elsif current_step == 5
        redirect_to facility_setup_new_path(step: next_step,
                                            facility_id: wizard_form.facility_id,
                                            room_id: wizard_form.room_id,
                                            section_id: wizard_form.section_id,
                                            row_id: wizard_form.row_id)
      else
        redirect_to current_step < 6 ?
                      facility_setup_new_path(facility_id: wizard_form.id, step: next_step) :
                      facility_setup_summary_path(facility_id: wizard_form.id)
      end
    else
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
      @wizard_form ||= FacilityRoomSetupForm.new(facility, room_id)
    when 4
      @wizard_form ||= FacilitySectionSetupForm.new(facility, room_id, section_id)
    when 5
      @wizard_form ||= FacilityRowSetupForm.new(facility, room_id, section_id, row_id)
    else
      @wizard_form ||= FacilitySummaryView.new(facility)
    end
  end

  def facility
    @facility ||= Facility.find(params[:facility_id]) if params[:facility_id]
  end

  def room_id
    @room_id ||= params[:room_id]
  end

  def section_id
    @section_id ||= params[:section_id]
  end

  def row_id
    @row_id ||= params[:row_id]
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
      facility_room_setup_params
    when 4
      facility_section_setup_params
    when 5
      facility_row_shelves_params
    else
      facility_room_count_params
    end
  end

  # Step 1
  def facility_basic_info_params
    params.require(:facility).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end

  # Step 2
  def facility_room_count_params
    params.require(:facility).permit(:room_count)
  end

  # Step 3
  def facility_room_setup_params
    params.require(:facility).permit(
      :room_name,
      :room_code,
      :room_desc,
      :room_have_sections,
      :room_section_count
    )
  end

  # Step 4
  def facility_section_setup_params
    params.require(:facility).permit(
      :section_name,
      :section_code,
      :section_desc,
      :section_purpose,
      :section_row_count,
      :section_shelf_count,
      :section_shelf_capacity,
      section_storage_types: [],
      section_cultivation_types: [],
    )
  end

  # Step 5
  def facility_row_shelves_params
    params.require(:facility).permit(
      :row_id,
      :row_name,
      :row_code,
      shelves: [:id, :code, :desc],
    )
  end
end
