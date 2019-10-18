module Charts
  class QueryPerformerList
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      if @args[:order_type].nil? or @args[:order_type] == 'yield'
        order = -1

        if @args[:order].present? && @args[:order] == 'top'
          order = -1
        else
          order = 1
        end

        #get maximum value of total dry weight
        max_result = Cultivation::Batch.collection.aggregate([
          {"$lookup": {
            from: 'inventory_harvest_batches',
            localField: '_id',
            foreignField: 'cultivation_batch_id',
            as: 'harvest_batch',
          }},
          {"$unwind": {path: '$harvest_batch'}},

          {"$project": {
            "max_dry_weight": {"$max": {"$sum": '$harvest_batch.total_dry_weight'}},
          }},
          {"$sort": {"max_dry_weight": -1}},

        ]).to_a
        if max_result.present?
          batches_json = Cultivation::Batch.collection.aggregate([
            {"$lookup": {
              from: 'inventory_harvest_batches',
              localField: '_id',
              foreignField: 'cultivation_batch_id',
              as: 'harvest_batch',
            }},
            {"$unwind": {path: '$harvest_batch'}},
            {"$project": {
              "batch_id": '$_id',
              "batch_name": '$name',
              "total_dry_weight": {"$sum": '$harvest_batch.total_dry_weight'},
              "harvest_name": '$harvest_batch.harvest_name',
              "max_dry_weight": {"$max": {"$sum": '$harvest_batch.total_dry_weight'}},
              "percentage": {"$multiply": [{"$divide": [{"$sum": '$harvest_batch.total_dry_weight'}, max_result[0]['max_dry_weight']]}, 100]},
            }},
            {"$sort": {"total_dry_weight": order}},

          ]).to_a
        else
          batches_json = []
        end
      else
        batches_json = Cultivation::Batch.collection.aggregate([
          {"$project": {
            "batch_id": '$_id',
            "batch_name": '$name',
            "revenue": '0',
          }},
        ]).to_a
      end
      batches_json
    end
  end
end
