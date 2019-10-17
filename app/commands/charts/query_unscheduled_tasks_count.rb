module Charts
  class QueryUnscheduledTasksCount
    prepend SimpleCommand

    def initialize; end

    def call
      criteria = Cultivation::Task.collection.aggregate([
        {"$match": {
          "$or": [
            {"batch_status": {"$eq": Constants::BATCH_STATUS_ACTIVE}},
            {"batch_status": {"$eq": Constants::BATCH_STATUS_SCHEDULED}},
          ],
          assignable: true,
        }},
        {"$match": {
          "$or": [
            {"estimated_hours": {"$eq": nil}},
            {"estimated_hours": {"$exists": false}},
            {"estimated_hours": {"$lte": 0}},
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
