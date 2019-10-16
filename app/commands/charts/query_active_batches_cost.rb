module Charts
  class QueryActiveBatchesCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @facility_id = args[:facility_id]
      @period = args[:period]
    end

    def call
      Cultivation::Batch.collection.aggregate([
        {"$match": {"facility_id": {"$in": @facility_id}}},
        {"$match": {"status": {"$in": [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]}}},
        match_period,
        {"$project": {
          "actual_cost": {"$ifNull": ['$actual_cost', 0]},
        }},
      ]).map { |x| x[:actual_cost] }.sum
    end

    private

    def match_period
      date = Time.zone.now
      if @period == 'this_month'
        start_date = date.beginning_of_month
        end_date = date.end_of_month
      elsif @period == 'this_year'
        start_date = date.beginning_of_year
        end_date = date.end_of_year
      elsif @period == 'this_week'
        start_date = date.beginning_of_week
        end_date = date.end_of_week
      else
        start_date = 'all'
      end

      if start_date == 'all'
        {"$match": {}}
      else
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$c_at', start_date]}, {"$lte": ['$c_at', end_date]}]},
              {"$and": [{"$gte": ['$c_at', start_date]}, {"$lte": ['$c_at', end_date]}]},
              {"$and": [{"$lte": ['$c_at', start_date]}, {"$gte": ['$c_at', end_date]}]},
            ],
          },
        }}
      end
    end
  end
end
