module People
  class QueryAbsentRate
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      absent_rate[:absent_rate]
    end

    private

    def absent_rate
      users = User.collection.aggregate([
        {
          "$match": {
            "facilities": {"$all": [@args[:facility_id].to_bson_id]},
          },
        },
      ])
      clocked_in_count = get_work_logs(users)
      expected_work_day = get_tasks(users).count
      total_absent = expected_work_day - clocked_in_count.count
      absent_rate = (total_absent.to_f / expected_work_day.to_f) * 100

      {
        clocked_in_count: clocked_in_count.count,
        total_absent: total_absent,
        expected_work_day: expected_work_day,
        absent_rate: absent_rate.round(2),
      }
    end

    def get_work_logs(users)
      work_logs_grouped = Common::WorkLog.collection.aggregate([
        {
          "$match": {
            "user_id": {"$in": users.to_a.pluck(:_id)},
          },
        },
        {
          "$match": {"$or": [
            {"$and": [
              {"end_time": {"$gte": @args[:start_date]}},
              {"start_time": {"$lte": @args[:end_date]}},
            ]},
            {"$and": [
              {"start_time": {"$gte": @args[:start_date]}},
              {"start_time": {"$lte": @args[:end_date]}},
            ]},
            {"$and": [
              {"start_time": {"$lte": @args[:start_date]}},
              {"end_time": {"$gte": @args[:end_date]}},
            ]},
          ]},
        },
        {"$group": {"_id": {"user_id": '$user_id', "start_time": {"$dateToString": {"format": '%Y-%m-%d', "date": '$start_time'}}}, "count": {"$sum": 1}}},

      ])
      work_logs_grouped
    end

    def get_tasks(users)
      tasks_grouped = Cultivation::Task.collection.aggregate([
        {
          "$match": {
            "user_ids": {"$in": users.to_a.pluck(:_id)},
          },
        },
        {
          "$match": {"$or": [
            {"$and": [
              {"end_date": {"$gte": @args[:start_date]}},
              {"start_date": {"$lte": @args[:end_date]}},
            ]},
            {"$and": [
              {"start_date": {"$gte": @args[:start_date]}},
              {"start_date": {"$lte": @args[:end_date]}},
            ]},
            {"$and": [
              {"start_date": {"$lte": @args[:start_date]}},
              {"end_date": {"$gte": @args[:end_date]}},
            ]},
          ]},
        },
        {"$group": {"_id": {"user_id": '$user_id', "start_date": {"$dateToString": {"format": '%Y-%m-%d', "date": '$start_date'}}}, "count": {"$sum": 1}}},

      ])
      tasks_grouped
    end
  end
end
