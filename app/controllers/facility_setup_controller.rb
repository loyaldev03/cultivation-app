class FacilitySetupController < ApplicationController
  layout 'wizards/facility_setup'

  # GET new facility - basic info form page - step 1
  def new
    @wizard_form = FacilityWizardForm::BasicInfoForm.new(params[:facility_id])
    render "facility_setup/step#{current_step}"
  end

  # POST update facility basic info - step 1 / submit
  def update_basic_info
    @wizard_form = FacilityWizardForm::BasicInfoForm.new(params[:facility_id])
    if @wizard_form.submit(facility_basic_info_params)
      redirect_to facility_setup_rooms_info_path(facility_id: wizard_form.id)
    else
      render "facility_setup/step#{current_step}"
    end
  end

  # GET show list of rooms in facility - step 2
  def rooms_info
    @rooms_info_form = FacilityWizardForm::RoomsForm.new(params[:facility_id])
  end

  # GET called through ajax when user click on Room
  def room_info
    @room_info_form = FacilityWizardForm::RoomInfoForm.new_by_id(
      params[:facility_id],
      params[:room_id],
      params[:room_name],
      params[:room_code],
    )
    # Build the RoomInfoForm object
    respond_to do |format|
      format.js
    end
  end

  # GET called through ajax when user changes room count (generate room template)
  def rooms_from_count
    facility_id = params[:facility_id]
    @rooms_info_form = FacilityWizardForm::RoomsForm.new(facility_id)
    rooms_count = params[:rooms_count].nil? ? 1 : params[:rooms_count].to_i
    @rooms_info_form.set_rooms_from_count(rooms_count)
    SaveFacilityRoomCount.call(facility_id, rooms_count)
    respond_to do |format|
      format.js
    end
  end

  # POST update specific room info - from the right sidebar
  def update_room_info
    form_object = FacilityWizardForm::UpdateRoomInfoForm.new
    respond_to do |format|
      if form_object.submit(room_info_params)
        @rooms_info_form = FacilityWizardForm::RoomsForm.new(form_object.facility_id)
        format.js
        # format.js { render :js => "toast('Room Saved', 'success')" }
      else
      end
    end
  end

  # POST
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
        if wizard_form.next_row.present?
          redirect_to facility_setup_new_path(step: current_step,
                                              facility_id: wizard_form.facility_id,
                                              room_id: wizard_form.room_id,
                                              section_id: wizard_form.section_id,
                                              row_id: wizard_form.next_row.id)
        elsif wizard_form.next_section.present?
          redirect_to facility_setup_new_path(step: 4,
                                              facility_id: wizard_form.facility_id,
                                              room_id: wizard_form.room_id,
                                              section_id: wizard_form.next_section.id)
        elsif wizard_form.next_room.present?
          redirect_to facility_setup_new_path(step: 3,
                                              facility_id: wizard_form.facility_id,
                                              room_id: wizard_form.next_room.id)
        else
          flash[:success] = "Facility setup completed: #{wizard_form.facility_name}" if wizard_form.is_all_complete?
          redirect_to root_path
        end
      else
        redirect_to root_path
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
      @wizard_form ||= FacilityWizardForm::BasicInfoForm.new(params[:facility_id])
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
    @facility ||= FindFacility.call({id: params[:facility_id]}).result unless params[:facility_id].blank?
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

  # Step - Update Basic Info
  def facility_basic_info_params
    params.require(:facility).permit(FacilityWizardForm::BasicInfoForm::ATTRS)
  end

  # Step - Update Room Info
  def room_info_params
    params.require(:room_info).permit(FacilityWizardForm::UpdateRoomInfoForm::ATTRS)
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
      :row_name,
      :row_code,
      :row_desc,
      shelves: [:id, :code, :capacity, :desc],
    )
  end
end
