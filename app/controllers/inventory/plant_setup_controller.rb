# TODO: To be renamed to Inventory::ActivePlantController
class Inventory::PlantSetupController < ApplicationController
  def index
    # Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
    @strain_types = Constants::STRAIN_TYPES
    @locations = QueryAllValidFacilityLocations.call.result
  end
end
