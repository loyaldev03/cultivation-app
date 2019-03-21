module Inventory
  class StrainsController < ApplicationController
    def index
      @facilities = Facility.completed
      @locations = QueryAllValidFacilityLocations.call(facility_id: params[:facility_id]).result
    end
  end
end
