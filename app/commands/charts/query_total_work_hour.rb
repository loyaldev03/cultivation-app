#worker dashboard
module Charts
  class QueryTotalWorkHour
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
      work_logs = Common::WorkLog.collection.aggregate([
        {"$match": {"user_id": @current_user&.id}},
        match_date,
        {"$addFields": {
          "totalHourSpent": {
            "$divide": [{
              "$subtract": ['$end_time', '$start_time'],
            }, 3600000],
          },
        }},
        {
          "$group": {
            _id: nil,
            total_hours: {
              "$sum": {"$trunc": ['$totalHourSpent']},
            },
          },
        },
        {"$project": {"_id": 0}},

      ])
      if work_logs.any?
        result = work_logs.first[:total_hours]
      else
        result = 0
      end
    end

    private

    def match_date
      if @st_date.present? && @ed_date.present?
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$end_time', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$gte": ['$start_time', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$lte": ['$start_time', @st_date]}, {"$gte": ['$end_time', @ed_date]}]},
            ],
          },
        }}
      else
        {'$match': {}}
      end
    end
  end
end
