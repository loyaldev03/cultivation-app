module Charts
  class QueryPlantDistributionByRoom
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility = Facility.find(@args[:facility_id])
      facility_strain_ids = facility.strains.map { |a| a.id.to_s }
      plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids})
      locations = QueryLocations.call(@args[:facility_id])
      group_plants = plants.group_by do |a|
        location = locations.query_trays(a.location_id)
        location&.first&.first[:row_purpose] if location&.first&.first.present? and location&.first&.first[:row_purpose].present?
      end

      group_plant_json = []

      group_plants.map do |b, c|
        if b.present?
          group_plant_json << {
            name: b,
            value: c.count,
          }
        end
      end
      return {children: group_plant_json}
    end
  end
end
