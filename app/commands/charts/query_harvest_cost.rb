module Charts
  class QueryHarvestCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
    end

    def call
      batch_ids = Cultivation::Batch.in(facility_id: @facility_id).pluck(:id)

      if @args[:order].present? && @args[:order] == 'top'
        order = -1
      else
        order = 1
      end

      result = Inventory::HarvestBatch.collection.aggregate([
        {"$match": {"cultivation_batch_id": {"$in": batch_ids}}},

        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'cultivation_batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": {path: '$batch', preserveNullAndEmptyArrays: true}},
        {"$addFields": {"cost": {"$cond": [{"$gt": [{"$toDecimal": '$total_wet_weight'}, 0]}, {"$divide": [{"$add": ['$batch.actual_labor_cost', '$batch.actual_material_cost']}, {"$toDecimal": '$total_wet_weight'}]}, 0.0]}}},
        {"$project": {
          "id": '$_id',
          "harvest_batch": '$harvest_name',
          "cost": {"$ifNull": [0, {"$toDouble": '$cost'}]},
        }},

        {"$sort": {"cost": order}},

      ]).to_a

      average = Inventory::HarvestBatch.collection.aggregate([
        {"$match": {"cultivation_batch_id": {"$in": batch_ids}}},

        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'cultivation_batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": {path: '$batch', preserveNullAndEmptyArrays: true}},
        {"$addFields": {"cost": {"$toDouble": {"$cond": [{"$gt": [{"$toDecimal": '$total_wet_weight'}, 0]}, {"$divide": [{"$add": ['$batch.actual_labor_cost', '$batch.actual_material_cost']}, {"$toDecimal": '$total_wet_weight'}]}, 0.0]}}}},
        {"$group": {
          "_id": 'null',
          "average": {"$avg": '$cost'},
        }},
      ]).to_a

      {
        average_harvest_cost: average[0].present? ? average[0]['average'].round(2) : 0.00,
        harvest_cost: result,
      }
    end
  end
end
