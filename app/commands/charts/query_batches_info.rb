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
      batches = Cultivation::Batch.where(facility_id: @args[:facility_id])

      active_batches = batches.select { |a| a[:status] == Constants::BATCH_STATUS_ACTIVE }.count
      draft_batches = batches.select { |a| a[:status] == Constants::BATCH_STATUS_DRAFT }.count
      scheduled_batches = batches.select { |a| a[:status] == Constants::BATCH_STATUS_SCHEDULED }.count

      active_batches_cost = Charts::QueryActiveBatchesCost.call(@args[:current_user], {facility_id: @args[:facility_id]}).result
      json = {
        active_batches: active_batches,
        draft_batches: draft_batches,
        scheduled_batches: scheduled_batches,
        active_batches_cost: active_batches_cost,
      }
    end
  end
end
