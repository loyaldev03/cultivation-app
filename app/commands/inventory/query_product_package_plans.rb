module Inventory
  class QueryProductPackagePlans
    prepend SimpleCommand

    def initialize(args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id - Batch to query
      }.merge(args)

      @batch_id = args[:batch_id]
    end

    def call
      criteria = Cultivation::ProductTypePlan.collection.aggregate([
        {"$match": {"batch_id": @batch_id}},
        {"$unwind": {
          "path": '$package_plans',
          "includeArrayIndex": 'position',
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
          "_id": 0,
          "product_category": '$product_type',
          "product_uom": '$package_plans.package_type',
          "position": 1,
          "strain_name": '$strain.strain_name',
          "harvest_name": '$harvest.harvest_name',
        }},
      ])

      results = criteria.map do |x|
        ProductPlanItem.new(
          x[:product_category],
          x[:product_uom],
          x[:position],
          x[:strain_name],
          x[:harvest_name],
        )
      end
      results || []
    end

    ProductPlanItem = Struct.new(:product_category,
                                 :product_uom,
                                 :position,
                                 :strain_name,
                                 :harvest_name)
  end
end
