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
      facility_by_rooms = QueryFacilitySummary.call(@user, {facility_id: @args[:facility_id]}).result
      facility_by_rooms.group_by { |d| d[:purpose] }.each_with_index do |(k, v), i|
        planned_capacity = 0
        total_capacity = 0
        percentage = 0
        v.map do |room|
          planned_capacity += room[:planned_capacity]
          total_capacity += room[:total_capacity]
        end
        available_spots = total_capacity - planned_capacity
        unless planned_capacity == 0 or total_capacity == 0
          percentage = (planned_capacity.to_f / total_capacity.to_f * 100.to_f).ceil
          percentage = 100 if percentage > 100
        end
        if (planned_capacity > 0 and total_capacity == 0) or (planned_capacity == total_capacity)
          percentage = 100
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
          available_spots_percentage: 100 - percentage,
          rooms: v,
        }
      end
      json
    end
  end
end
