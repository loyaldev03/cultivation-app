module Charts
  class QueryHarvestYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility = Facility.find(@args[:facility_id])
      batches = Cultivation::Batch.where(facility_id: @args[:facility_id])
      harvest_batches = Inventory::HarvestBatch.in(cultivation_batch_id: batches.map { |a| a.id.to_s }).includes(:cultivation_batch)
      sum_yield = 0
      harvest_json = harvest_batches.map do |a|
        yield_amount = a.total_wet_weight / facility.square_foot rescue 0.0
        sum_yield += yield_amount
        {
          id: a.id.to_s,
          harvest_batch: a.harvest_name,
          yield: yield_amount.round(2),
        }
      end

      if @args[:order].present?
        if @args[:order] == 'top'
          harvest_json = harvest_json.sort_by { |a| -a[:yield] }
        else
          harvest_json = harvest_json.sort_by { |a| a[:yield] }
        end
      end

      {
        average_harvest_yield: (sum_yield.to_f / harvest_batches.size).round(2),
        harvest_yield: harvest_json,
      }
    end
  end
end
