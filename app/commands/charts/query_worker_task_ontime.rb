#worker dashboard
module Charts
  class QueryWorkerTaskOntime
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
      tasks = @current_user.cultivation_tasks.where(work_status: Constants::WORK_STATUS_DONE)

      if tasks.count > 0
        tasks.map do |t|
          count = t.time_logs.and({start_time: {"$gte": @st_date}, end_time: {"$lte": @ed_date}, user_id: @current_user.id}).map { |tl| tl.duration_in_hours }.sum

          if count > 0 && count <= t.estimated_hours
            ontime += 1
          end
        end
      end

      return ontime
    end
  end
end
