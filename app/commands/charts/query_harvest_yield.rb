module Charts
  class QueryHarvestYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      facilities = Facility.in(id: @facility_id)
      batch_ids = Cultivation::Batch.in(facility_id: facilities.pluck(:id)).pluck(:id)

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
        {"$lookup": {
          from: 'facilities',
          localField: 'batch.facility_id',
          foreignField: '_id',
          as: 'facility',
        }},
        {"$unwind": {path: '$facility', preserveNullAndEmptyArrays: true}},
        {"$project": {
          "id": {"$toString": '$_id'},
          "harvest_batch": '$harvest_name',
          "total_wet_weight": '$total_wet_weight',
          "square_foot": '$facility.square_foot',
          "facility_name": '$facility.name',
          "yield": {"$toDouble": {"$divide": [{"$toDecimal": '$total_wet_weight'}, '$facility.square_foot']}},
        }},
        {"$sort": {"yield": order}},
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
        {"$lookup": {
          from: 'facilities',
          localField: 'batch.facility_id',
          foreignField: '_id',
          as: 'facility',
        }},
        {"$unwind": {path: '$facility', preserveNullAndEmptyArrays: true}},
        {"$addFields": {"yield": {"$toDouble": {"$divide": [{"$toDecimal": '$total_wet_weight'}, '$facility.square_foot']}}}},
        {"$group": {
          "_id": 'null',
          "average": {"$avg": '$yield'},
        }},
      ]).to_a

      {
        average_harvest_yield: average[0].present? ? average[0]['average'].round(2) : 0.0,
        harvest_yield: result,
      }
    end
  end
end
