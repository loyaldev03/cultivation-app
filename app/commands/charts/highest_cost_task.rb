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
            {"user_ids": {"$ne": 'nil'}},
            {"user_ids": {"$exists": true}},
          ],
        }},
        {"$match": {
          "$or": [
            {"batch_status": {"$eq": 'ACTIVE'}},
            {"batch_status": {"$eq": 'SCHEDULED'}},
          ],
          assignable: true,
        }},
        {"$sort": {"actual_labor_cost": -1, "actual_hours": -1}},
        {"$limit": 5},
        {"$project": {
          name: 1,
          batch_id: 1,
          start_date: 1,
          end_date: 1,
          actual_labor_cost: 1,
          actual_hours: 1,
        }},
      ]).to_a
      [{
        range: @args[:range],
        total_actual_cost: tasks_query.map { |h| h[:actual_labor_cost] }.sum,
        total_sum_actual_hours: tasks_query.map { |h| h[:actual_hours] }.sum,
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
