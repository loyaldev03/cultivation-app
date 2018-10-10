module Inventory
  class SearchPlants
    prepend SimpleCommand
    attr_reader :facility_strain_id,
      :current_growth_stage,
      :search

    def initialize(facility_strain_id, current_growth_stage, search)
      @facility_strain_id = facility_strain_id
      @current_growth_stage = current_growth_stage
      @search = search
    end

    def call
      plants = Inventory::Plant.includes(:facility_strain)
                               .where(current_growth_stage: current_growth_stage)

      if facility_strain_id.blank?
        plants = []
      else
        plants = plants.where(facility_strain_id: facility_strain_id)
        plants = plants.where(plant_id: /^#{search}/i) unless search.blank?
        plants = plants.limit(7)
      end
      plants
    end
  end
end
