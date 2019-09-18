module Inventory
  class StrainsController < ApplicationController
    before_action :verify_facility_setup

    def index
      authorize! :index, Inventory::StrainsController
      @facilities = Facility.completed
    end
  end
end
