module Charts
  class QueryActiveBatchesCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args

      @facilities = args[:facility_id].map { |x| x.to_bson_id }

      date = Time.zone.now
      @period = args[:period]

      if @period == 'this_week'
        @date_st = date.beginning_of_week
        @date_nd = date.end_of_week
      elsif @period == 'this_month'
        @date_st = date.beginning_of_month
        @date_nd = date.end_of_month
      elsif @period == 'this_year'
        @date_st = date.beginning_of_year
        @date_nd = date.end_of_year
      end
    end

    def call
      batches = Cultivation::Batch.collection.aggregate([
        {"$match": {"facility_id": {"$in": @facilities}}},
        {"$match": {"status": {"$in": [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]}}},
        match_date,
        {"$project": {
          "actual_cost": {"$ifNull": ['$actual_cost', 0]},
        }},

      ])

      return batches.map { |x| x[:actual_cost] }.sum
    end

    private

    def match_date
      if @date_st.present? && @date_nd.present?
        {'$match': {'$and': [
          {'c_at': {'$gte': @date_st}},
          {'c_at': {'$lt': @date_nd}},
        ]}}
      else
        {'$match': {}}
      end
    end
  end
end
