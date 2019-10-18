module Charts
  class QueryDelayedTasksCount
    prepend SimpleCommand

    def initialize; end

    def call
      criteria = Cultivation::Task.collection.aggregate([
        {"$match": {
          batch_status: {"$eq": Constants::BATCH_STATUS_ACTIVE},
          work_status: {"$ne": Constants::WORK_STATUS_DONE},
          end_date: {"$lte": Time.current},
          assignable: true,
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
