module Charts
  class QueryPlantDistributionByRoom
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = args[:facility_id].split(',')
    end

    def call
      if resource_shared?
        strains = Inventory::FacilityStrain.in(facility_id: active_facility_ids).pluck(:id)
      else
        strains = Inventory::FacilityStrain.in(facility_id: @facility_id.map { |x| x.to_bson_id }).pluck(:id)
      end
      plants = Inventory::Plant.collection.aggregate([
        {"$match": {"location_purpose": {"$ne": nil}}},
        {"$match": {"facility_strain_id": {"$in": strains}}},
        {"$group": {
          "_id": '$location_purpose',
          "name": {"$first": {"$ifNull": ['$location_purpose', 'No Group']}},
          "value": {"$sum": 1},
        }},
      ])

      if plants.any?
        return {children: plants}
      else
        return {}
      end
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
