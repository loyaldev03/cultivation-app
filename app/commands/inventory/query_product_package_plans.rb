module Inventory
  class QueryProductPackagePlans
    prepend SimpleCommand

    ProductPlanItem = Struct.new(:product_type,
                                 :product_uom,
                                 :no,
                                 :strain,
                                 :harvest_name)

    def initialize(args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id - Batch to query
      }.merge(args)

      @batch_id = args[:batch_id]
    end

    def call
      criteria = Cultivation::ProductTypePlan.collection.aggregate [
        {"$match": {"batch_id": @batch_id}},
        {"$unwind": {
          "path": '$package_plans',
          "includeArrayIndex": 'no',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {
          "from": 'inventory_harvest_batches',
          "localField": 'harvest_batch_id',
          "foreignField": '_id',
          "as": 'harvest',
        }},
        {"$unwind": '$harvest'},
        {"$lookup": {
          "from": 'inventory_facility_strains',
          "localField": 'harvest.facility_strain_id',
          "foreignField": '_id',
          "as": 'strain',
        }},
        {"$unwind": '$strain'},
        {"$project": {
          "product_type": 1,
          "product_uom": '$package_plans.package_type',
          "no": 1,
          "strain": '$strain.strain_name',
          "harvest_name": '$harvest.harvest_name',
        }},
      ]

      criteria.map { |x| ProductPlanItem.new(x) } || []
    end
  end
end
