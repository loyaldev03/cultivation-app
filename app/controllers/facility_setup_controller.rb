class FacilitySetupController < ApplicationController
  layout 'wizards/facility_setup'
  authorize_resource class: false
  before_action :validate_params, only: [:rooms_info, :room_summary, :row_shelf_info]
  before_action :set_home_status
  before_action :set_available_purposes, only: [:room_info, :section_info]

  # GET new facility - basic info form page - step 1
  def new
    onboarding_check_status
    @wizard_form = FacilityWizardForm::BasicInfoForm.new(params[:facility_id])
    render 'facility_setup/step1'
  end

  def onboarding_check_status
    if params[:onboarding_type].present?
      @facility = Facility.find(params[:facility_id])

      if @facility.is_complete && @facility.is_enabled &&
         @facility.rooms.find_by(purpose: Constants::CONST_MOTHER).is_complete &&
         @facility.rooms.find_by(purpose: Constants::CONST_CLONE).is_complete &&
         (@facility.rooms.find_by(purpose: Constants::CONST_VEG).is_complete ||
          @facility.rooms.find_by(purpose: Constants::CONST_VEG1).is_complete ||
          @facility.rooms.find_by(purpose: Constants::CONST_VEG2).is_complete) &&
         @facility.rooms.find_by(purpose: Constants::CONST_FLOWER).is_complete &&
         @facility.rooms.find_by(purpose: Constants::CONST_HARVEST).is_complete &&
         @facility.rooms.find_by(purpose: Constants::CONST_TRIM).is_complete &&
         @facility.rooms.find_by(purpose: Constants::CONST_STORAGE).is_complete &&
         @facility.rooms.find_by(purpose: Constants::CONST_DRY)
        @facility.update_onboarding('ONBOARDING_FACILITY')
      end
    end
  end

  # POST update facility basic info - step 1 / submit
  def update_basic_info
    is_draft = params[:commit] == 'draft'
    @wizard_form = FacilityWizardForm::BasicInfoForm.new(selected_facility_id)
    if @wizard_form.submit(facility_basic_info_params, current_user)
      if params[:company_info].present? and params[:company_info]
        render 'layouts/hide_sidebar', layouts: nil, locals: {message: 'Facility successfully updated'}
      else
        if is_draft
          redirect_to facility_setup_new_path(facility_id: @wizard_form.id)
        else
          redirect_to facility_setup_rooms_info_path(facility_id: @wizard_form.id)
        end
      end
    else
      if params[:company_info].present? and params[:company_info]
        render 'layouts/hide_sidebar', layouts: nil
      else
        render 'facility_setup/step1'
      end
    end
  end

  # GET show list of rooms in facility - step 2
  def rooms_info
    @rooms_info_form = FacilityWizardForm::RoomsForm.new(selected_facility_id)
  end

  # GET called through ajax when user click on Room
  def room_info
    @room_info_form = FacilityWizardForm::RoomInfoForm.new_by_id(
      selected_facility_id,
      params[:room_id],
      params[:room_name],
      params[:room_code]
    )
    # Build the RoomInfoForm object
    respond_to do |format|
      format.js
    end
  end

  # GET called throught ajax when user click on edit Section
  def section_info
    @section_info_form = FacilityWizardForm::SectionInfoForm.new_by_id(
      selected_facility_id,
      params[:room_id],
      params[:section_id],
      params[:section_name],
      params[:section_code]
    )
    respond_to do |format|
      format.js
    end
  end

  # POST called through ajax when user changes room count (generate room record)
  def generate_rooms
    facility_id = selected_facility_id
    @mode = params[:mode]

    @rooms_info_form = FacilityWizardForm::RoomsForm.new(facility_id)
    rooms_count = params[:rooms_count].nil? ? 1 : params[:rooms_count].to_i
    @rooms_info_form.generate_rooms(rooms_count)
    if @mode == 'new'
      SaveFacilityWizardRooms.call(facility_id, @rooms_info_form.rooms, true)
    elsif @mode == 'increment'
      SaveFacilityWizardRooms.call(facility_id, [@rooms_info_form.rooms.last])
    end

    respond_to do |format|
      format.js
    end
  end

  # POST update specific room info - from the right panel
  def update_room_info
    is_continue = params[:commit] == 'continue'
    form_object = FacilityWizardForm::UpdateRoomInfoForm.new

    # LOGIC#0001 - No rows setup for these types of room
    if Constants::ROOM_ONLY_SETUP.include?(room_info_params[:purpose])
      is_continue = false
    end

    respond_to do |format|
      if form_object.submit(room_info_params, current_user)
        if is_continue
          room_path = facility_setup_room_summary_path(
            facility_id: form_object.facility_id,
            room_id: form_object.id,
          )
          format.js { render js: "Turbolinks.visit('#{room_path}')" }
        else
          @rooms_info_form = FacilityWizardForm::RoomsForm.new(form_object.facility_id)
          format.js
        end
      end
    end
  end

  # POST update specific section info - from the right panel
  def update_section_info
    form_object = FacilityWizardForm::UpdateSectionInfoForm.new

    respond_to do |format|
      if form_object.submit(section_info_params, current_user)
        room_path = facility_setup_row_shelf_info_path(
          facility_id: form_object.facility_id,
          room_id: form_object.room_id,
        )
        format.js { render js: "Turbolinks.visit('#{room_path}')" }
      end
    end
  end

  # POST delete a room
  def destroy_room
    @facility_id = selected_facility_id
    @room_id = params[:room_id]
    SaveFacilityDestroyRoom.call(@facility_id, @room_id)
    respond_to do |format|
      @rooms_info_form = FacilityWizardForm::RoomsForm.new(@facility_id)
      format.js
    end
  end

  def destroy_all_rooms
    @facility_id = selected_facility_id
    SaveFacilityDestroyAllRooms.call(@facility_id)
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
    @rows_form = FacilityWizardForm::RowsForm.new(selected_facility_id, params[:room_id])
  end

  # GET when user changes number of rows
  def generate_rows
    facility_id = selected_facility_id
    room_id = params[:room_id]
    section_id = params[:section_id]
    mode = params[:mode]
    # number of rows to generate / the N(th) rows to be generate
    rows_count = params[:rows_count].nil? ? 1 : params[:rows_count].to_i

    @rows_form = FacilityWizardForm::RowsForm.new(facility_id, room_id)
    # Rails.logger.debug ">>>>>> original size #{@rows_form.rows.size}"

    if mode == 'new'
      # generate number of rows (user select # from select control)
      @rows_form.generate_rows(rows_count, section_id)
      # Rails.logger.debug ">>>>>> generate_rows 5.1"
      # Rails.logger.debug ">>>>>> generate_rows 5.1.1 #{@rows_form.rows.size}"
      SaveFacilityWizardRows.call(facility_id, room_id, @rows_form.rows, true)
    elsif mode == 'increment'
      # generate additional 1 row (user click the add row button)
      @rows_form.generate_rows(@rows_form.rows.size + 1, section_id)
      # Rails.logger.debug ">>>>>> generate_rows 5.2"
      # Rails.logger.debug ">>>>>> generate_rows 5.2.1 #{@rows_form.rows.size}"
      SaveFacilityWizardRows.call(facility_id, room_id, [@rows_form.rows.last])
    end

    respond_to do |format|
      format.js
    end
  end

  def add_section
    facility_id = selected_facility_id
    room_id = params[:room_id]

    SaveFacilityAddSection.call(facility_id, room_id)
    @rows_form = FacilityWizardForm::RowsForm.new(facility_id, room_id)

    respond_to do |format|
      format.js { render template: 'facility_setup/generate_rows' }
    end
  end

  def destroy_section
    facility_id = selected_facility_id
    room_id = params[:room_id]
    section_id = params[:section_id]

    SaveFacilityDestroySection.call(facility_id, room_id, section_id)
    @rows_form = FacilityWizardForm::RowsForm.new(facility_id, room_id)
    respond_to do |format|
      format.js { render template: 'facility_setup/generate_rows' }
    end
  end

  # GET called through ajax when user click on "SET UP ROW"
  def row_info
    @row_info_form = FacilityWizardForm::RowInfoForm.new_by_id(
      selected_facility_id,
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
    # This value should be same as the value in "Save & Continue"
    # button (_row_info_form).
    # When "continue", user will be redirec to next shelf update form
    # of the current row
    is_continue = params[:commit] == 'continue'
    @show_duplicate_dialog = params[:commit] == 'duplicate'
    @form_object = FacilityWizardForm::UpdateRowInfoForm.new(is_continue)
    respond_to do |format|
      if @form_object.submit(row_info_params, current_user)
        @row_info_form = FacilityWizardForm::RowInfoForm.new(@form_object.facility_id,
                                                             @form_object.room_id,
                                                             @form_object.result)
        if is_continue
          @row_shelves_trays_form = get_row_shelves_trays_form(
            row_info_params[:facility_id],
            row_info_params[:room_id],
            row_info_params[:id]
          )
          format.js { render template: 'facility_setup/update_row_continue' }
        else
          format.js
        end
      end
    end
  end

  # POST delete a row
  def destroy_row
    @facility_id = selected_facility_id
    @room_id = params[:room_id]
    @row_id = params[:row_id]
    SaveFacilityDestroyRow.call(@facility_id, @room_id, @row_id)
    respond_to do |format|
      @rows_form = FacilityWizardForm::RowsForm.new(@facility_id,
                                                    @room_id)
      format.js
    end
  end

  # GET toggle between different shelves
  def row_shelf_trays
    respond_to do |format|
      @row_shelves_trays_form = get_row_shelves_trays_form(
        selected_facility_id,
        params[:room_id],
        params[:row_id],
        params[:shelf_id]
      )
      format.js
    end
  end

  def update_shelf_trays
    form_object = FacilityWizardForm::UpdateShelfTraysForm.new(shelf_trays_params)
    if form_object.submit(shelf_trays_params, current_user)
      if form_object.duplicate_target.present?
        SaveShelvesByDuplicating.call(form_object.facility_id,
                                      form_object.room_id,
                                      form_object.row_id,
                                      form_object.id,
                                      form_object.duplicate_target)
      end

      respond_to do |format|
        # To refresh a single row card in the carousel
        @row_info_form = FacilityWizardForm::RowInfoForm.find_by_id(form_object.facility_id,
                                                                    form_object.room_id,
                                                                    form_object.row_id)
        @row_shelves_trays_form = get_row_shelves_trays_form(
          form_object.facility_id,
          form_object.room_id,
          form_object.row_id,
          form_object.id,
        )

        if @row_shelves_trays_form.is_last_shelf
          # NOTE: Offer duplicate row function (see update_shelf_trays.js.erb)
          @row_shelves_trays_form.show_duplicate_dialog = true
        else
          # NOTE: Return form object for next shelf (move user to setup next shelf)
          @row_shelves_trays_form.set_next_shelf(@row_shelves_trays_form.current_shelf_index)
        end
        # Rails.logger.debug ">>> update_shelf_trays.current_shelf_index"
        # Rails.logger.debug ">>> update_shelf_trays #{@row_shelves_trays_form.current_shelf_index}"
        format.js
      end
    else
      nil
    end
  end

  def destroy_tray
    @facility_id = selected_facility_id
    @room_id = params[:room_id]
    @row_id = params[:row_id]
    @shelf_id = params[:shelf_id]
    @tray_id = params[:id]
    DestroyShelfTray.call(@tray_id)
    respond_to do |format|
      @row_shelves_trays_form = FacilityWizardForm::RowShelvesTraysForm.new(
        @facility_id,
        @room_id,
        @row_id,
        @shelf_id,
      )
      format.js
    end
  end

  def generate_tray
    @facility_id = selected_facility_id
    @room_id = params[:room_id]
    @row_id = params[:row_id]
    @shelf_id = params[:shelf_id]
    SaveShelfAddTray.call(@facility_id, @room_id, @row_id, @shelf_id)
    respond_to do |format|
      @row_shelves_trays_form = FacilityWizardForm::RowShelvesTraysForm.new(
        @facility_id,
        @room_id,
        @row_id,
        @shelf_id,
      )
      format.js
    end
  end

  def duplicate_rows
    @facility_id = selected_facility_id
    @room_id = params[:room_id]
    @row_id = params[:row_id]
    @target_rows = params[:target_rows].split(',')

    duplicate_cmd = SaveRowByDuplicating.call(@facility_id,
                                              @room_id,
                                              @row_id,
                                              @target_rows)
    respond_to do |format|
      format.js
    end
  end

  def whitelist_ip
    @facility = Facility.find(selected_facility_id)
    public_ip = request.remote_ip
    if @facility.whitelist_ips.include? (public_ip) #if current ip doesnt exist in array
      flash[:error] = 'Public Ip address existed in whitelist record'
    else
      @facility.whitelist_ips << public_ip
      @facility.save
      flash[:notice] = 'Public Ip Address added into whitelist record'
    end
    redirect_to facility_setup_new_path(facility_id: selected_facility_id)
  end

  private

  def validate_params
    if selected_facilities_ids.blank? || selected_facilities_ids.length != 1
      flash[:error] = 'Select a facility to proceed'
      redirect_to facility_setup_invalid_params_path
    end
  end

  def selected_facility_id
    if selected_facilities_ids.blank? || selected_facilities_ids.length != 1
      flash[:error] = 'Select a facility to proceed'
      Rollbar.error('No access to facility')
    else
      selected_facilities_ids[0]
    end
  end

  def set_home_status
    @home = HomeSetupStatus.call(current_facility).result
  end

  def set_available_purposes
    cmd = Common::QueryAvailableRoomPurpose.call
    @available_purposes = cmd.result_options
  end

  def get_row_shelves_trays_form(facility_id, room_id, row_id, shelf_id = nil)
    @row_shelves_trays_form = FacilityWizardForm::RowShelvesTraysForm.new(
      facility_id,
      room_id,
      row_id,
      shelf_id,
    )
  end

  # Step - Update Basic Info
  def facility_basic_info_params
    params.require(:facility).permit(FacilityWizardForm::BasicInfoForm::ATTRS)
  end

  # Step - Update Room Info (Right Panel)
  def room_info_params
    params.require(:room_info).permit(FacilityWizardForm::UpdateRoomInfoForm::ATTRS)
  end

  # Step - Update Section Info (Right Panel)
  def section_info_params
    params.require(:section_info).permit(FacilityWizardForm::UpdateSectionInfoForm::ATTRS)
  end

  # Step - Update Row Info (Right Panel)
  def row_info_params
    params.require(:row_info).permit(FacilityWizardForm::UpdateRowInfoForm::ATTRS)
  end

  # Step - Update Shelf & Trays
  def shelf_trays_params
    params.require(:shelf_trays_info).permit(
      :facility_id,
      :room_id,
      :row_id,
      :id,
      :code,
      :duplicate_target,
      trays: [:id, :code, :capacity, :capacity_type],
    )
  end
end
