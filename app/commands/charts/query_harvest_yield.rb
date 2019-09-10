module Charts
  class QueryHarvestYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      harvest_json = []
      facilities = Facility.in(id: @facility_id)
      sum_yield = 0
      size = 0
      facilities.each do |f|
        batches = Cultivation::Batch.where(facility_id: f.id)
        harvest_batches = Inventory::HarvestBatch.in(cultivation_batch_id: batches.map { |a| a.id.to_s }).includes(:cultivation_batch)
        size += harvest_batches.size
        harvest_batches.each do |a|
          yield_amount = a.total_wet_weight / f.square_foot rescue 0.0
          sum_yield += yield_amount
          harvest_json << {
            id: a.id.to_s,
            harvest_batch: a.harvest_name,
            yield: yield_amount.round(2),
          }
        end
      end

      if @args[:order].present?
        if @args[:order] == 'top'
          harvest_json = harvest_json.sort_by { |a| -a[:yield] }
        else
          harvest_json = harvest_json.sort_by { |a| a[:yield] }
        end
      end

      {
        average_harvest_yield: (sum_yield.to_f / size.to_f).round(2),
        harvest_yield: harvest_json,
      }
    end
  end
end
