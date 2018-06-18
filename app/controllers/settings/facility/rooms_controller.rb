class Settings::Facility::RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end
end
