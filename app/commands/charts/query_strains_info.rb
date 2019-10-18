module Charts
  class QueryStrainsInfo
    prepend SimpleCommand

    def initialize(facility_id)
      @facility_id = facility_id.split(',')
    end

    def call
      if resource_shared?
        facilities = Facility.in(_id: active_facility_ids).pluck(:id)
      else
        facilities = Facility.in(_id: @facility_id.map { |x| x.to_bson_id }).pluck(:id)
      end

      query_infos = Inventory::FacilityStrain.collection.aggregate([
        {"$match": {"facility_id": {"$in": facilities}}},
        {"$group": {_id: '$strain_type', total_strain: {"$sum": 1}}},
        {"$project": {
          "_id": 0,
          "name": '$_id',
          "total_strain": 1,
        }},
      ])
    end

    def resource_shared?
      CompanyInfo.last.enable_resouces_sharing
    end

    def active_facility_ids
      Facility.where(is_enabled: true).pluck(:id)
    end
  end
end

[children: [{}]]
