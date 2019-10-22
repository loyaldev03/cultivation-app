#worker dashboard
module Charts
  class QueryWorkerTasksDone
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
      task_done = Cultivation::Task.collection.aggregate([
        {"$match": {"user_ids": {"$in": [@current_user&.id]}}},
        {"$match": {"work_status": Constants::WORK_STATUS_DONE}},
        match_date,

      ])

      task_done.count
    end

    private

    def match_date
      if @st_date.present? && @ed_date.present?
        {"$match": {
          "$expr": {
            "$or": [
              #{"$and": [{"$gte": ['$end_date', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$gte": ['$start_date', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$lte": ['$start_date', @st_date]}, {"$gte": ['$end_time', @ed_date]}]},
            ],
          },
        }}
      else
        {'$match': {}}
      end
    end
  end
end
