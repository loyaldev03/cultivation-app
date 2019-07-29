module Charts
  class QueryCultivationInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      total_plants = Charts::QueryTotalActivePlant.call(@args[:current_user], {facility_id: @args[:facility_id]}).result
      total_yield = Charts::QueryTotalYield.call(@args[:current_user], {facility_id: @args[:facility_id], period: @args[:period]}).result
      active_batches_cost = Charts::QueryActiveBatchesCost.call(@args[:current_user], {facility_id: @args[:facility_id], period: @args[:period]}).result

      result = QueryFacilitySummary.call(facility_id: @args[:facility_id]).result
      total_used = 0
      total_capacity = 0
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
        projected_yield: 0,
        active_batches_cost: active_batches_cost,
        facility_capacity: facility_capacity_used,
      }
    end
  end
end
