module Charts
  class FacilityOverview
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      available_spots = 0
      facility = Facility.find(@args[:facility_id])
      facility_capacity = Charts::QueryCultivationInfo.call(@user, {facility_id: @args[:facility_id], period: 'all'}).result[:facility_capacity]
      harvest_yeild = Charts::QueryHarvestYield.call(@user, {facility_id: @args[:facility_id], order: ''}).result[:average_harvest_yield]
      facility_summary = QueryFacilitySummary.call(facility_id: @args[:facility_id]).result
      facility_summary.map do |x|
        available_spots += x[:total_capacity]
      end

      {
        facility_capacity: facility_capacity,
        available_spots: available_spots,
        average_yield: facility.square_foot ? harvest_yeild / facility.square_foot : 0,
      }
    end
  end
end
