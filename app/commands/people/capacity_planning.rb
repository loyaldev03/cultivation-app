module People
  class CapacityPlanning
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      users = User.where(is_active: true).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
      json = []
      Common::Role.all.map do |role|
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        capacity = 0
        user_count = []
        actual = 0
        percentage = 0
        users.each do |user|
          if user.roles.include?(role.id)
            user_actual = 0
            user_capacity = 0
            user_percentage = 0
            Cultivation::Task.where(facility_id: @args[:facility_id]).includes(:time_logs).map do |x|
              time_logs = range(x.time_logs.where(user_id: user.id.to_s), @args[:period])
              time_logs.map { |time_log| user_actual += time_log.duration_in_hours }
            end
            work_schedules = range(user.work_schedules, @args[:period])
            work_schedules.map { |work_schedule| user_capacity += ((work_schedule.end_time - work_schedule.start_time) / 3600) }
            capacity += user_capacity
            user_percentage = ((user_capacity - user_actual) / user_capacity * 100).ceil unless user_actual == 0
            user_count << {
              email: user.email,
              photo_url: user.photo_url,
              first_name: user.first_name,
              last_name: user.last_name,
              actual: user_actual.round(0),
              capacity: user_capacity.round(0),
              user_percentage: 100 - user_percentage,
              skills: user.skills,
            }
            actual += user_actual.round(0)
          end
        end
        percentage = ((capacity - actual) / capacity * 100).ceil unless actual == 0
        json << {
          title: role.name,
          color: color_pick,
          capacity: capacity.round(0),
          actual: actual.round(0),
          percentage: percentage,
          users: user_count,
        }
      end
      json
    end

    def range(data, range)
      date = Time.current
      if (range == 'this_week')
        data.where(:end_time.gt => date.beginning_of_week, :start_time.lt => date.end_of_week)
      elsif (range == 'this_year')
        data.where(:end_time.gt => date.beginning_of_year, :start_time.lt => date.end_of_year)
      elsif (range == 'this_month')
        data.where(:end_time.gt => date.beginning_of_month, :start_time.lt => Time.current.end_of_month)
      else
        data.all
      end
    end
  end
end
