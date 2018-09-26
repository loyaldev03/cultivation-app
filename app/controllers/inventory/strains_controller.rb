module Inventory
  class StrainsController < ApplicationController
    def index
      @facilities = Facility.completed
      @locations = QueryAllValidFacilityLocations.call.result
    end
  end
end
