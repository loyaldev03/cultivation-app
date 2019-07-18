module Charts
  class QueryCultivationInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      #things needed
      #total active plants
      #total weight of all yield
      #projected yield of all active batches
      #active batches cost to date
      #facility capacity

      total_plants = Charts::QueryTotalActivePlant.call(@args[:current_user], {facility_id: @args[:facility_id]}).result
      total_yield = Charts::QueryTotalYield.call(@args[:current_user], {facility_id: @args[:facility_id], period: @args[:period]}).result
      active_batches_cost = Charts::QueryActiveBatchesCost.call(@args[:current_user], {facility_id: @args[:facility_id], period: @args[:period]}).result
      json = {
        total_plants: total_plants,
        total_yield: total_yield,
        projected_yield: 0,
        active_batches_cost: active_batches_cost,
        facility_capacity: 20,
      }
    end
  end
end
