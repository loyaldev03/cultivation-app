class Settings::Facility::RoomsController < ApplicationController
  def index
    @facilities = Facility.all
    @rooms = []

    if params[:facility_id].present?
      @rooms = @facilities.find(params[:facility_id]).rooms.reverse
    else
      @facilities.each do |f|
        @rooms.concat f.rooms.reverse
      end
    end
  end

  def new
    @room = FacilitiesForm::RoomCreate.new
  end

  def create
    @room = FacilitiesForm::RoomCreate.new(room_params)

    if @room.save
      redirect_to settings_facility_rooms_path(facility_id: @room.facility)
    else
      render 'new'
    end
  end

  def edit
    @room = FacilitiesForm::RoomUpdate.find(params[:id])
  end

  def update
    @room = FacilitiesForm::RoomUpdate.find(params[:id])
    if @room.update(room_update_params)
      redirect_to settings_facility_rooms_path(facility_id: @room.facility)
    else
      render 'edit'
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
