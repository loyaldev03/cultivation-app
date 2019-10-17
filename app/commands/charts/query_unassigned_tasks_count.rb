module Charts
  class QueryUnassignedTasksCount
    prepend SimpleCommand

    def initialize; end

    def call
      criteria = Cultivation::Task.collection.aggregate([
        {"$match": {
          "$or": [
            {"batch_status": {"$eq": Constants::BATCH_STATUS_ACTIVE}},
          ],
          assignable: true,
        }},
        {"$match": {
          "$or": [
            {"user_ids": {"$eq": nil}},
            {"user_ids": {"$exists": false}},
          ],
        }},
        {"$count": 'count'},
      ])
      if criteria.to_a.any?
        criteria.to_a[0]['count']
      else
        0
      end
    end
  end
end
