module Charts
  class QueryCultivationInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user

      raise ArgumentError, 'period' if args[:period].blank?
      raise ArgumentError, 'facility_ids' if args[:facility_ids].blank?
      raise ArgumentError, 'facility_ids' unless (args[:facility_ids].is_a? Array)

      @period = args[:period]
      @facility_ids = args[:facility_ids]
    end

    def call
      total_plants = Charts::QueryTotalActivePlant.call(
        @user,
        facility_ids: @facility_ids,
        period: @period,
      ).result

      total_yield = 0 # Charts::QueryTotalYield.call(@user, {facility_id: @facility_ids, period: @period}).result
      active_batches_cost = 0 # Charts::QueryActiveBatchesCost.call(@user, {facility_id: @facility_ids, period: @period}).result
      projected_yield = 0 # Charts::QueryProjectedYield.call(@user, {facility_id: @facility_ids, period: @period}).result

      result = QueryFacilitySummary.call(@user, facility_ids: @facility_ids).result
      total_used = 0
      total_capacity = 0
      facility_capacity_used = 0
      result.map do |c|
        total_capacity += c[:total_capacity]
        total_used += (c[:total_capacity] - c[:available_capacity])
      end

      if total_capacity.positive?
        facility_capacity_used = (total_used / total_capacity) * 100
      end

      {
        total_plants: total_plants,
        total_yield: total_yield,
        projected_yield: projected_yield,
        active_batches_cost: active_batches_cost,
        facility_capacity: facility_capacity_used,
      }
    end

    private

    def scopped_batches
      @scopped_batches ||= Charts::QueryActiveBatches.call(
        period: @period,
        facility_ids: @facility_id,
      ).result
    end
  end
end
