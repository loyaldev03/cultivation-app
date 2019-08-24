module Charts
  class QueryPlantDistributionByRoom
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
    end

    def call
      facilities = Facility.in(id: @facility_id)

      json_fac = []
      facilities.each do |facility|
        facility_strain_ids = facility.strains.map { |a| a.id.to_s }
        plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids})
        locations = QueryLocations.call([facility.id])
        #raise ""
        group_plants = plants.group_by do |a|
          location = locations.query_trays(a.location_id)
          location&.first&.first[:row_purpose] if location&.first&.first.present? and location&.first&.first[:row_purpose].present?
        end
        json_fac << {
          group_plant: group_plants.map do |n|
            {
              group: n[0],
              count: n[1].count,
            }
          end,
        }
      end
      array = json_fac.inject { |memo, el| memo.merge(el) { |k, old_v, new_v| old_v + new_v } }

      #return array

      array2 = array.map { |x| x[1] }

      group_count = array2.inject { |memo, el| memo.merge(el) { |k, old_v, new_v| old_v + new_v } }

      grouped_plant_json = group_count.group_by { |x| x[:group] }.map do |f|
        if f[0].present?
          {
            name: f[0],
            value: f[1].map { |x| x[:count] }.sum,
          }
        end
      end

      return {children: grouped_plant_json.compact}
    end
  end
end
