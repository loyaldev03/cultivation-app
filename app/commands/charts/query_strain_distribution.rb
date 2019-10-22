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
        facility_strains = Inventory::FacilityStrain.in(facility_id: @user.facilities)
      else
        facility_strains = Inventory::FacilityStrain.in(facility_id: @facility_id)
      end

      result = Cultivation::Batch.collection.aggregate([
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
          "value": {"$sum": '$quantity'},
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
  end
end

[children: [{}]]
