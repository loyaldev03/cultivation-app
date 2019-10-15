module Charts
  class UnassignedTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map(&:to_bson_id)
      @limit = args[:limit]
    end

    def call
      start_date = Time.current.beginning_of_month
      end_date = Time.current.end_of_month
      Cultivation::Task.collection.aggregate([
        {"$match": {
          "facility_id": {"$in": @facility_id},
          "assignable": true,
          "batch_status": Constants::BATCH_STATUS_ACTIVE,
        }},
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$end_date', start_date]}, {"$lte": ['$start_date', end_date]}]},
              {"$and": [{"$gte": ['$start_date', start_date]}, {"$lte": ['$start_date', end_date]}]},
              {"$and": [{"$lte": ['$start_date', start_date]}, {"$gte": ['$end_date', end_date]}]},
            ],
          },
        }},
        set_limit,
        {"$project": {
          name: 1,
          batch_id: 1,
          start_date: 1,
          end_date: 1,
          batch_name: '$batch_name',
        }},
      ])
    end

    def set_limit
      if @limit
        {"$limit": @limit.to_i}
      else
        {"$limit": {}}
      end
    end
  end
end
