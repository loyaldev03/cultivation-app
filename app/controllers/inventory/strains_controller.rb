module Inventory
  class StrainsController < ApplicationController
    def index
      authorize! :index, Inventory::StrainsController
      @facilities = Facility.completed
    end
  end
end
