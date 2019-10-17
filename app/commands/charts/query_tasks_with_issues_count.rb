module Charts
  class QueryTasksWithIssuesCount
    prepend SimpleCommand

    def initialize; end

    def call
      criteria = Issues::Issue.collection.aggregate([
        {"$match": {
          "cultivation_batch_id": {"$exists": true},
          "status": 'open',
        }},
        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'cultivation_batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": {path: '$batch'}},
        {"$match": {
          "$or": [
            {"batch.status": {"$eq": Constants::BATCH_STATUS_ACTIVE}},
            {"batch.status": {"$eq": Constants::BATCH_STATUS_SCHEDULED}},
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
