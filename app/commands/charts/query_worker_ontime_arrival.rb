#worker dashboard
module Charts
  class QueryWorkerOntimeArrival
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @range = args[:range]
      if @range == 'daily'
        @st_date = Time.current.beginning_of_week
        @ed_date = Time.current.end_of_week
      elsif @range == 'weekly'
        @st_date = Time.current.beginning_of_month
        @ed_date = Time.current.end_of_month
      elsif @range == 'monthly'
        @st_date = Time.current.beginning_of_year
        @ed_date = Time.current.end_of_year
      end
    end

    def call
      ontime = 0
      @current_user.work_schedules.each do |d|
        date = d.date.to_date if d.date
        if date.present?
          tl = @current_user.work_logs.and({start_time: {"$gte": @st_date}, end_time: {"$lte": @ed_date}}).detect { |x| x if x.start_time.to_date == date }
          dws = Time.zone.parse("#{d.date.strftime('%Y-%m-%d')} #{d.start_time.strftime('%H:%M')}")
          if tl.present?
            utl = tl.start_time
            if utl <= dws
              ontime += 1
            end
          end
        end
      end

      return ontime
    end
  end
end
