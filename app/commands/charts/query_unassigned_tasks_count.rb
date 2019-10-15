module Charts
  class QueryUnassignedTasksCount
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
            {"user_ids": {"$eq": nil}},
            {"user_ids": {"$exists": false}},
          ],
        }},
        {"$count": 'unassigned_tasks'},
      ])
      result = criteria.to_a[0]['unassigned_tasks']
    end
  end
end
