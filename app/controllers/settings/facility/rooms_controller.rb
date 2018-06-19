class Settings::Facility::RoomsController < ApplicationController
  def index
    @facilities = Facility.all
    @rooms = []

    if params[:facility_id].present?
      @rooms = @facilities.find(params[:facility_id]).rooms
    else
      @facilities.each do |f|
        @rooms.concat f.rooms
      end
    end
  end

  def new
    @room = Room.new
  end

  def create
    createRoom = Facilities::CreateRoomCommand.call(params[:room][:facility], room_params)

    if createRoom.success?
      redirect_to settings_facility_rooms_path(facility_id: createRoom.facility)
    else
      @room = createRoom.room
      render 'new'
    end
  end

  private

  def room_params
    params.require(:room).permit(:code, :desc)
  end
end
