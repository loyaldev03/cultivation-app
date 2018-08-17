class Inventory::PlantSetupController < ApplicationController
  def index
    # Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
    @strain_types = Constants::STRAIN_TYPES
    @locations = QueryAllValidFacilityLocations.call.result
  end

  # def t1
  #   render json: [ data: 'here']
  #   # respond_to do |format|
  #   #   format.json do
  #   #     render json: [ data: 'here']
  #   #   end
  #   # end
  # end

  def create
  end

  def update
  end

  def create_inventory
  end
end
