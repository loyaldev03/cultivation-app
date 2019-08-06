module People
  class QueryTardinessRate
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      tardiness_rate
    end

    private

    def tardiness_rate
      users = User.collection.aggregate([
        {
          "$match": {
            "facilities": {"$all": [@args[:facility_id].to_bson_id]},
          },
        },
      ])
      cond_a = Common::WorkLog.and({end_time: {"$gte": @args[:start_date]}},
                                   start_time: {"$lte": @args[:end_date]}).selector
      cond_b = Common::WorkLog.and({start_time: {"$gte": @args[:start_date]}},
                                   start_time: {"$lte": @args[:end_date]}).selector
      cond_c = Common::WorkLog.and({start_time: {"$lte": @args[:start_date]}},
                                   end_time: {"$gte": @args[:end_date]}).selector

      work_logs = Common::WorkLog.or(cond_a, cond_b, cond_c)

      work_logs = work_logs.where(:user_id.in => users.to_a.pluck(:_id))
      work_log_count = work_logs.count
      work_log_absent_count = work_logs.select { |a| a.status == 'late' }.count
      tardiness = (work_log_absent_count.to_f / work_log_count.to_f) * 100
      return tardiness.round(2)
    end
  end
end
