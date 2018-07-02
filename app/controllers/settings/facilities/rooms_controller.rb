class Settings::Facilities::RoomsController < ApplicationController
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
      render 'layouts/hide_sidebar', layout: nil
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
      render 'layouts/hide_sidebar', layout: nil
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
