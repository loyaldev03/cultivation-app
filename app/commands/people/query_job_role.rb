module People
  class QueryJobRole
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      main = []
      months = I18n.t('date.abbr_month_names').compact
      Common::Role.all.map do |role|
        data = []
        months.map do |m|
          data << {
            month: m,
            total: 0,
          }
        end
        user_count = 0
        User.all.map do |user|
          if user.roles.include?(role.id)
            user_count += 1
            tasks = user.cultivation_tasks.where(facility_id: @args[:facility_id]).includes(:time_logs)
              .group_by { |m| m.start_date.beginning_of_month }
              .sort_by { |date, data| date }

            calculate_duration = calculate_duration(tasks, user.id.to_s)
            calculate_duration.map do |c|
              find_data = data.find { |x| x[:month] == c[:month] }
              if c[:month] == find_data[:month]
                find_data[:total] += c[:total].round(2)
              end
            end
          end
        end
        main << {
          role: role.name,
          toatal_user: user_count,
          data: data,
        }
      end
      main
    end

    def calculate_duration(tasks, u_id)
      calculate_duration = []
      tasks.map do |date, datas|
        durations = 0
        datas.map do |data|
          time_logs = range(data.time_logs.where(user_id: u_id))
          time_logs.map { |time_log| durations += time_log.duration_in_hours }
        end
        calculate_duration << {
          month: date.strftime('%b'),
          total: durations,
        }
      end
      calculate_duration
    end

    def range(data)
      date = Time.parse("#{@args[:period]}-01-01")
      data.where(:end_time.gt => date.beginning_of_year, :start_time.lt => date.end_of_year)
    end
  end
end
