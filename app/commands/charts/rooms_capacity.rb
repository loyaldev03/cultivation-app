module Charts
  class RoomsCapacity
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
      json = []
      facility_by_rooms = QueryFacilitySummary.call(facility_id: @args[:facility_id]).result
      facility_by_rooms.group_by { |d| d[:purpose] }.each_with_index do |(k, v), i|
        planned_capacity = 0
        total_capacity = 0
        available_spots_percentage = 0
        v.map do |room|
          planned_capacity += room[:planned_capacity]
          total_capacity += room[:total_capacity]
        end
        available_spots = total_capacity - planned_capacity
        unless total_capacity == 0
          available_spots_percentage = (planned_capacity.to_f / total_capacity.to_f * 100.to_f).ceil
        end
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        json <<
        {
          purpose: k,
          color: color_pick,
          total_rooms: v.count,
          total_capacity: total_capacity,
          available_spots: available_spots,
          available_spots_percentage: available_spots_percentage,
          rooms: v,
        }
      end
      json
    end
  end
end
