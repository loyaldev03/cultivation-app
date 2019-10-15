module Charts
  class QueryUnscheduledTasksCount
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
            {"estimated_hours": {"$eq": nil}},
            {"estimated_hours": {"$exists": false}},
            {"estimated_hours": {"$lte": 0}},
          ],
        }},
        {"$count": 'unscheduled_tasks'},
      ])
      result = criteria.to_a[0]['unscheduled_tasks']
    end
  end
end
