module Charts
  class QueryStrainDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
    end

    def call
      if resource_shared?
        facility_strains = Inventory::FacilityStrain.in(facility_id: active_facility_ids).includes(:plants)
      else
        facility_strains = Inventory::FacilityStrain.in(facility_id: @facility_id).includes(:plants)
      end

      result = Inventory::Plant.collection.aggregate([
        {"$match": {"facility_strain_id": {"$in": facility_strains.pluck(:id)}}},
        {"$lookup": {
          from: 'inventory_facility_strains',
          localField: 'facility_strain_id',
          foreignField: '_id',
          as: 'facility_strain',
        }},
        {"$unwind": {path: '$facility_strain', preserveNullAndEmptyArrays: true}},
        {"$group": {
          "_id": '$facility_strain_id',
          "name": {"$first": '$facility_strain.strain_name'},
          "value": {"$sum": 1},
        }},

      ]).to_a

      if result.any?
        return {children: result}
      else
        return {}
      end
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
