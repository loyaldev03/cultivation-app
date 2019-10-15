module Charts
  class QueryPlantDistributionByRoom
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = args[:facility_id]
    end

    def call

      locations = QueryLocations.call(@facility_id)
      plants = Inventory::Plant.collection.aggregate([
        {"$lookup": {
          from: 'inventory_facility_strains',
          localField: 'facility_strain_id',
          foreignField: '_id',
          as: 'facility_strain',
        }},
        {"$unwind": {path: '$facility_strain', preserveNullAndEmptyArrays: true}},
        {"$match": {"facility_strain.facility_id": {"$in": @facility_id}}},
        {"$project": {
          "plant_id": 1,
          "location_id": 1
          
        }}
      
      ])

      group_plants = plants.group_by do |a|
          location = locations.query_trays(a[:location_id])
          location&.first&.first[:row_purpose] if location&.first&.first.present? and location&.first&.first[:row_purpose].present?
      end

      json_fac = []

      json_fac << {
        group_plant: group_plants.map do |n|
          {
            group: n[0],
            count: n[1].count,
          }
        end,
      }

      array = json_fac.inject { |memo, el| memo.merge(el) { |k, old_v, new_v| old_v + new_v } }

      if array.present?
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
        else
          grouped_plant_json = []
        end

      return {children: grouped_plant_json.compact}
    end

    private

    def resource_shared?
      CompanyInfo.last.enable_resouces_sharing
    end

    def active_facility_ids
      Facility.where(is_enabled: true).pluck(:id)
    end
  end
end
