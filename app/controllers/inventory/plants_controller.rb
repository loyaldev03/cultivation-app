class Inventory::PlantsController < ApplicationController
  before_action :load_facility_strains, only: [:mothers, :cultivation_batches]
  before_action :load_batches, only: [:clones, :vegs, :flowers, :harvest_batches, :manicure]

  def index
    # Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
    @strain_types = Constants::STRAIN_TYPES
    @locations = QueryAllValidFacilityLocations.call.result
  end

  def mothers
    @locations = QueryAllValidFacilityLocations.call.result
  end

  def cultivation_batches
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

  # def waste_logs
  # end

  # def destroy_plant
  # end

  private

  def load_batches
    @cultivation_batches = Cultivation::Batch.includes(:facility_strain).all
  end

  def load_facility_strains
    @facility_strains = Inventory::FacilityStrain.includes(:facility).all.map do |x|
      {
        value: x.id.to_s,
        label: "#{x.strain_name} - (#{x.facility.name})",
        strain_name: x.strain_name,
        facility_id: x.facility_id.to_s,
      }
    end
  end
end
