module Charts
  class RoomsCapacity
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      json = []
      facility_by_rooms = QueryFacilitySummary.call(facility_id: @args[:facility_id]).result
      facility_by_rooms.group_by { |d| d[:purpose] }.map do |k, v|
        planned_capacity = 0
        total_capacity = 0
        v.map do |room|
          planned_capacity += room[:planned_capacity]
          total_capacity += room[:total_capacity]
        end
        available_spots = total_capacity - planned_capacity
        json <<
        {
          purpose: k,
          total_rooms: v.count,
          total_capacity: total_capacity,
          available_spots: available_spots,
          rooms: v,
        }
      end
      json
    end
  end
end
