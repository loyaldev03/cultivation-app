class Settings::Facility::FacilitiesController < ApplicationController  
  def index
    # render plain: 'facilities root'
    @facilities = Facility.all
  end

  def all
    # render plain: 'facilities listing'
  end
end
