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
        user_count = 0
        actual = 0
        users.each do |user|
          if user.roles.include?(role.id)
            Cultivation::Task.where(facility_id: @args[:facility_id]).includes(:time_logs).map do |x|
              time_logs = range(x.time_logs.where(user_id: user.id.to_s), @args[:period])
              time_logs.map { |time_log| actual += time_log.duration_in_hours }
            end
            work_schedules = range(user.work_schedules, @args[:period])
            work_schedules.map { |work_schedule| capacity += ((work_schedule.end_time - work_schedule.start_time) / 3600) }
            user_count += 1
          end
        end
        json << {
          title: role.name,
          color: color_pick,
          user_count: user_count,
          capacity: capacity.round(0),
          actual: actual.round(0),
        }
      end
      json
    end

    def range(work_schedules, range)
      date = Time.current
      if (range == 'this week')
        work_schedules.where(:end_time.gt => date.beginning_of_week, :start_time.lt => date.end_of_week)
      elsif (range == 'this year')
        work_schedules.where(:end_time.gt => date.beginning_of_year, :start_time.lt => date.end_of_year)
      elsif (range == 'this month')
        work_schedules.where(:end_time.gt => date.beginning_of_month, :start_time.lt => Time.current.end_of_month)
      else
        work_schedules.all
      end
    end
  end
end
