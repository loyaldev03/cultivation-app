module Charts
  class QueryUnassignedTasksCount
    prepend SimpleCommand

    def initialize; end

    def call
      criteria = Cultivation::Task.collection.aggregate([
        {"$match": {
          "$or": [
            {"batch_status": {"$eq": 'ACTIVE'}},
            {"batch_status": {"$eq": 'SCHEDULED'}},
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
