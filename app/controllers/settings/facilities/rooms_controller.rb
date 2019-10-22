class Settings::Facilities::RoomsController < ApplicationController
  def index
    facility_ids = if selected_facilities_ids.blank?
                     current_user_facilities_ids
                   else
                     selected_facilities_ids
                   end

    @rooms = QueryFacilitySummary.call(current_user, facility_ids: facility_ids)
  end

  def new
    @room = FacilitiesForm::RoomCreate.new
  end

  def create
    @room = FacilitiesForm::RoomCreate.new(room_params)

    if @room.save
      render 'layouts/hide_sidebar', layout: nil, locals: {message: 'Room successfully created'}
    else
      render 'new'
    end
  end

  def edit
    @room = FacilitiesForm::RoomUpdate.find(params[:id])
    render 'edit', layout: nil
  end

  def update
    @room = FacilitiesForm::RoomUpdate.find(params[:id])
    if @room.update(room_update_params)
      render 'layouts/hide_sidebar', layout: nil, locals: {message: 'Room successfully updated'}
    else
      render 'edit', layout: nil
    end
  end

  private

  def room_params
    params.require(:facilities_form_room_create).permit(:code, :name, :desc, :facility_id)
  end

  def room_update_params
    params.require(:facilities_form_room_update).permit(:code, :name, :desc, :facility_id)
  end
end
