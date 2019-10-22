module Charts
  class FacilityOverview
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      f_ids = @args[:facility_id].split(',').map(&:to_bson_id)
      available_spots = 0
      total_used = 0
      facility_capacity_used = 0
      facilities = Facility.find(f_ids)
      harvest_yeild = Charts::QueryHarvestYield.call(
        @user,
        facility_id: @args[:facility_id],
        order: '',
      ).result[:average_harvest_yield]
      facility_summary = QueryFacilitySummary.call(
        @user,
        facility_ids: f_ids,
      ).result
      facility_summary.map do |x|
        available_spots += x[:total_capacity]
        total_used += (x[:total_capacity] - x[:available_capacity])
      end
      unless available_spots == 0
        facility_capacity_used = (total_used / available_spots) * 100
      end
      sf = facilities.map(&:square_foot).compact.sum
      {
        facility_capacity: facility_capacity_used,
        available_spots: available_spots,
        average_yield: sf == 0 ? 0 : (harvest_yeild / sf),
      }
    end
  end
end
