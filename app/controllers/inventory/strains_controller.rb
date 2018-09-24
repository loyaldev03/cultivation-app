module Inventory
  class StrainsController < ApplicationController
    def index
      @facilities = Facility.completed
    end
  end
end
