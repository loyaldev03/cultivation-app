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

  # POST called through ajax when user changes room count (generate room record)
  def generate_rooms
    facility_id = params[:facility_id]
    mode = params[:mode]

    @rooms_info_form = FacilityWizardForm::RoomsForm.new(facility_id)
    rooms_count = params[:rooms_count].nil? ? 1 : params[:rooms_count].to_i
    @rooms_info_form.generate_rooms(rooms_count)
    if mode == 'new'
      SaveFacilityWizardRooms.call(facility_id, @rooms_info_form.rooms, true)
    elsif mode == 'increment'
      SaveFacilityWizardRooms.call(facility_id, [@rooms_info_form.rooms.last])
    end

    respond_to do |format|
      format.js
    end
  end

  # POST update specific room info - from the right panel
  def update_room_info
    form_object = FacilityWizardForm::UpdateRoomInfoForm.new
    respond_to do |format|
      if form_object.submit(room_info_params)
        @rooms_info_form = FacilityWizardForm::RoomsForm.new(form_object.facility_id)
        format.js
      else
      end
    end
  end

  # POST delete a room
  def destroy_room
    @facility_id = params[:facility_id]
    @room_id = params[:room_id]
    SaveFacilityDestroyRoom.call(@facility_id, @room_id)
    respond_to do |format|
      @rooms_info_form = FacilityWizardForm::RoomsForm.new(@facility_id)
      format.js
    end
  end

  # GET show room setup summary
  def room_summary
    @room_summary_form = FacilityWizardForm::RoomSummaryForm.new(params)
  end

  # GET show row & shelf setup page
  # User can dynamically changes the number of rows
  def row_shelf_info
    @rows_form = FacilityWizardForm::RowsForm.new(params[:facility_id], params[:room_id])
  end

  # GET when user changes number of rows
  def generate_rows
    facility_id = params[:facility_id]
    room_id = params[:room_id]
    mode = params[:mode]

    @rows_form = FacilityWizardForm::RowsForm.new(facility_id, room_id)
    rows_count = params[:rows_count].nil? ? 1 : params[:rows_count].to_i
    @rows_form.generate_rows(rows_count)

    if mode == 'new'
      SaveFacilityWizardRows.call(facility_id, room_id, @rows_form.rows, true)
    elsif mode == 'increment'
      SaveFacilityWizardRows.call(facility_id, room_id, [@rows_form.rows.last])
    end

    respond_to do |format|
      format.js
    end
  end

  # GET called through ajax when user click on Row
  def row_info
    @row_info_form = FacilityWizardForm::RowInfoForm.new_by_id(
      params[:facility_id],
      params[:room_id],
      params[:row_id],
      params[:row_name],
      params[:row_code]
    )
    respond_to do |format|
      format.js
    end
  end

  # POST update specific row info - from right panel
  def update_row_info
    form_object = FacilityWizardForm::UpdateRowInfoForm.new
    respond_to do |format|
      if form_object.submit(row_info_params)
        @rows_form = FacilityWizardForm::RowsForm.new(form_object.facility_id,
                                                          form_object.room_id)
        format.js
      end
    end
  end

  # POST delete a row
  def destroy_row
    @facility_id = params[:facility_id]
    @room_id = params[:room_id]
    @row_id = params[:row_id]
    SaveFacilityDestroyRow.call(@facility_id, @room_id, @row_id)
    respond_to do |format|
      @rows_form = FacilityWizardForm::RowsForm.new(@facility_id,
                                                    @room_id)
      format.js
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

  # Step - Update Room Info (Right Panel)
  def room_info_params
    params.require(:room_info).permit(FacilityWizardForm::UpdateRoomInfoForm::ATTRS)
  end

  # Step - Update Row Info (Right Panel)
  def row_info_params
    params.require(:row_info).permit(FacilityWizardForm::UpdateRowInfoForm::ATTRS)
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
