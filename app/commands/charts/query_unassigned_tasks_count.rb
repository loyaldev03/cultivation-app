module Charts
  class QueryUnassignedTasksCount
    prepend SimpleCommand

    def initialize
    end

    def call
      criteria = Cultivation::Task.collection.aggregate([
        { "$match": {
            "$or": [
            {"user_ids": {"$eq": nil }},
            {"user_ids": {"$exists": false }},
          ],
        }},
        { "$lookup":
            {
                from: "cultivation_batches",
                localField: "batch_id",
                foreignField: "_id",
                as: "batch"
            }
        },
        { "$unwind": { path: "$batch", preserveNullAndEmptyArrays: true } }, 
        { "$match": {
            "$or": [
                { "batch.status": {"$eq": "ACTIVE" }}
            ],
            }
        },
        { "$count": "unassigned_tasks" }
      ])
      result = criteria.to_a[0]["unassigned_tasks"]
    end
  end
end