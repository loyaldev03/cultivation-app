module People
  class ArrivalOnTime
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      users = User.where(exempt: false).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      if (@args[:order] == 'late')
        most_late = total_late(users)
        me = {
          data: most_late.sort_by { |k, v| k[:percentage] }.reverse.first(5),
          average: most_late.map { |x| x[:value] }.sum.to_f / most_late.map { |x| x[:work_schedules] }.sum.to_f * 100,
        }
      else (@args[:order] == 'ontime')
        most_ontime = total_clocked_in(users)
        me = {
        data: most_ontime.sort_by { |k, v| k[:percentage] }.reverse.first(5),
        average: most_ontime.map { |x| x[:value] }.sum.to_f / most_ontime.map { |x| x[:work_schedules] }.sum.to_f * 100,
      }       end

      return me
    end

    private

    def total_clocked_in(users)
      Rails.logger.debug('MASUKK')
      json_array = []
      role = @args[:role]
      if role.present?
        w = users.map { |x| x if x.roles.include?(@args[:role].to_bson_id) }.compact
      else
        w = users
      end
      w.each do |u|
        ontime = 0
        u.work_schedules.ne(date: nil).each do |d|
          date = d.date.to_date
          tl = u.time_logs.map { |x| x if x.start_time.to_date == date }.compact.first
          dws = Time.zone.parse("#{d.date.strftime('%Y-%m-%d')} #{d.start_time.strftime('%H:%M')}")
          if tl.present?
            utl = tl.start_time
            if utl <= dws
              ontime += 1
            end
          end
        end

        if ontime != 0
          percentage = (ontime.to_f / u.work_schedules.count.to_f) * 100
        else
          percentage = 0
        end

        if role.present?
          roles = Common::Role.find(@args[:role]).name
        else
          roles = u.roles.map { |x| Common::Role.find(x).name }.join(', ')
        end
        json_array << {
          user: u,
          value: ontime,
          work_schedules: u.work_schedules.count,
          percentage: percentage,
          roles: roles,
        }
      end

      return json_array
    end

    def total_late(users)
      json_array = []
      role = @args[:role]
      if role.present?
        w = users.map { |x| x if x.roles.include?(@args[:role].to_bson_id) }.compact
      else
        w = users
      end

      w.each do |u|
        late = 0
        u.work_schedules.ne(date: nil).each do |d|
          date = d.date.to_date
          tl = u.time_logs.map { |x| x if x.start_time.to_date == date }.compact.first
          dws = Time.zone.parse("#{d.date.strftime('%Y-%m-%d')} #{d.start_time.strftime('%H:%M')}")
          if tl.present?
            utl = tl.start_time
            if utl > dws
              late += 1
            end
          end
        end

        if late != 0
          percentage = (late.to_f / u.work_schedules.count.to_f) * 100
        else
          percentage = 0
        end
        if role.present?
          roles = Common::Role.find(@args[:role]).name
        else
          roles = u.roles.map { |x| Common::Role.find(x).name }.join(', ')
        end

        json_array << {
          user: u,
          value: late,
          work_schedules: u.work_schedules.count,
          percentage: percentage,
          roles: roles,
        }
      end

      return json_array
    end
  end
end
