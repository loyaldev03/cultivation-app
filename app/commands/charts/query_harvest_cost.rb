module Charts
  class QueryHarvestCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batches = Cultivation::Batch.where(facility_id: @args[:facility_id])
      harvest_batches = Inventory::HarvestBatch.in(cultivation_batch_id: batches.map { |a| a.id.to_s }).includes(:cultivation_batch)
      sum_cost = 0
      harvest_json = harvest_batches.map do |a|
        cost = (a.cultivation_batch.actual_labor_cost + a.cultivation_batch.actual_material_cost) / a.total_wet_weight
        sum_cost += cost
        {
          harvest_batch: a.harvest_name,
          cost: cost,
        }
      end

      {
        average_harvest_cost: (sum_cost / harvest_batches.count),
        harvest_cost: harvest_json,
      }
    end
  end
end
