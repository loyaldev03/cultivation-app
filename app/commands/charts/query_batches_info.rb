module Charts
  class QueryBatchesInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      #things needed
      #active batches
      #batches in draft
      #unscheduled batches
      #cost of active batches to date
      facilities = @args[:facility_id].split(',')
      batches = Cultivation::Batch.collection.aggregate([
        {"$match": {"facility_id": {"$in": facilities.map { |x| x.to_bson_id }}}},
        {"$group": {_id: '$status', total_batches: {"$sum": 1}}},
      ])
      #return batches
      active_batches = batches.select { |a| a[:_id] == Constants::BATCH_STATUS_ACTIVE }.first
      draft_batches = batches.select { |a| a[:_id] == Constants::BATCH_STATUS_DRAFT }.first
      scheduled_batches = batches.select { |a| a[:_id] == Constants::BATCH_STATUS_SCHEDULED }.first

      active_batches_cost = Charts::QueryActiveBatchesCost.call(@args[:current_user], {facility_id: facilities}).result
      json = {
        active_batches: active_batches.present? ? active_batches[:total_batches] : 0,
        draft_batches: draft_batches.present? ? draft_batches[:total_batches] : 0,
        scheduled_batches: scheduled_batches.present? ? scheduled_batches[:total_batches] : 0,
        active_batches_cost: active_batches_cost,
      }
      return json
    end
  end
end
