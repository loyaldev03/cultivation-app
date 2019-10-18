module Charts
  class QueryProjectedYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
      @facility_id = @args[:facility_id]
    end

    def call
      Inventory::HarvestBatch.collection.aggregate([
        match_period,
        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'cultivation_batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": '$batch'},
        {"$match": {"batch.facility_id": {"$in": @facility_id}}},
        {"$addFields": {
          total: {
            "$sum": {
              "$cond": {
                "if": {"$eq": ['$total_cure_weight', 0]},
                "then": '$total_dry_weight',
                "else": '$total_cure_weight',
              },
            },
          },
        }},
        "$project": {
          _id: 0,
          total: 1,
        },
      ]).to_a.map { |x| x[:total] }.sum
    end

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
