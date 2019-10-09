module Charts
  class QueryCultivationInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
    end

    def call
      facilities = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      total_plants = Charts::QueryTotalActivePlant.call(@user, {facility_id: facilities, period: @period}).result
      total_yield = Charts::QueryTotalYield.call(@user, {facility_id: facilities, period: @period}).result
      active_batches_cost = Charts::QueryActiveBatchesCost.call(@user, {facility_id: facilities, period: @period}).result
      projected_yield = Charts::QueryProjectedYield.call(@user, {facility_id: facilities, period: @period}).result

      result = QueryFacilitySummary.call(@user, {facility_id: @args[:facility_id]}).result
      total_used = 0
      total_capacity = 0
      facility_capacity_used = 0
      result.map do |c|
        total_capacity += c[:total_capacity]
        total_used += (c[:total_capacity] - c[:available_capacity])
      end

      unless total_capacity == 0
        facility_capacity_used = (total_used / total_capacity) * 100
      end

      json = {
        total_plants: total_plants,
        total_yield: total_yield,
        projected_yield: projected_yield,
        active_batches_cost: active_batches_cost,
        facility_capacity: facility_capacity_used,
      }
    end
  end
end
