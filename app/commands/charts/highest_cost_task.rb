module Charts
  class HighestCostTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      tasks_query = Cultivation::Task.collection.aggregate([
        {"$match": {"facility_id": {"$in": @facility_id}}},
        {"$match": {"indent": {"$nin": [0]}}},
        match_range,
        {"$match": {
          "$or": [
            {"user_ids": {"$ne": 'null'}},
            {"user_ids": {"$exists": true}},
          ],
        }},
        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": '$batch'},
        {"$match": {"batch.status": {"$in": [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]}}},
        {"$lookup": {
          from: 'cultivation_time_logs',
          localField: '_id',
          foreignField: 'task_id',
          as: 'time_logs',
        }},
        {"$addFields": {
          "sum_actual_hours": {
            "$sum": {
              "$map": {
                "input": '$time_logs',
                "in": {"$divide": [{"$subtract": ['$$this.end_time', '$$this.start_time']}, 3600000]},
              },
            },
          },
        }},
        {"$sort": {"actual_cost": -1, "sum_actual_hours": -1}},
        {"$limit": 5},
        {"$project": {
          name: 1,
          batch_id: 1,
          start_date: 1,
          end_date: 1,
          actual_cost: {"$ifNull": ['$actual_cost', 0]},
          # batch_status: '$batch.status',
          sum_actual_hours: 1,
        }},
      ]).to_a
      [{
        range: @args[:range],
        total_actual_cost: tasks_query.map { |h| h[:actual_cost].nil? ? 0 : h[:actual_cost] }.sum.round(2),
        total_sum_actual_hours: tasks_query.map { |h| h[:sum_actual_hours] }.sum.round(2),
        tasks: tasks_query,
      }]
    end

    def match_range
      if @args[:range] == 'this_month'
        start_date = Time.current.beginning_of_month
        end_date = Time.current.end_of_month
      elsif @args[:range] == 'this_year'
        start_date = Time.current.beginning_of_year
        end_date = Time.current.end_of_year
      elsif @args[:range] == 'this_week'
        start_date = Time.current.beginning_of_week
        end_date = Time.current.end_of_week
      else
        start_date = 'all'
      end

      if start_date == 'all'
        {"$match": {}}
      else
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$end_date', start_date]}, {"$lte": ['$start_date', end_date]}]},
              {"$and": [{"$gte": ['$start_date', start_date]}, {"$lte": ['$start_date', end_date]}]},
              {"$and": [{"$lte": ['$start_date', start_date]}, {"$gte": ['$end_date', end_date]}]},
            ],
          },
        }}
      end
    end
  end
end
