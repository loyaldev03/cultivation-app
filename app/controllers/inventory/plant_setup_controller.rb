# TODO: To be renamed to Inventory::ActivePlantController
class Inventory::PlantSetupController < ApplicationController
  def index
    # Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
    @strain_types = Constants::STRAIN_TYPES
    @locations = QueryAllValidFacilityLocations.call.result
  end

  def mothers
  end

  def clones
  end

  def vegs
  end

  def flowers
  end

  def harvest_batches
  end

  def manicure(batches)
  end

  def waste_logs
  end

  def destroy_plant
  end
end
