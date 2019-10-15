module Charts
  class IssueList
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      Issues::Issue.collection.aggregate([
        {"$match": {"is_archived": {"$eq": false}}},
        {"$match": {"status": {"$eq": 'open'}}},
        {"$lookup": {
          from: 'cultivation_batches',
          localField: 'cultivation_batch_id',
          foreignField: '_id',
          as: 'batch',
        }},
        {"$unwind": '$batch'},
        {"$match": {"batch.facility_id": {"$in": @facility_id}}},
        {"$project": {
          issue_no: 1,
          cultivation_batch_id: {"$toString": '$cultivation_batch_id'},
          severity: 1,
          c_at: 1,
          status: 1,
          title: 1,
          batch_no: '$batch.batch_no',
        }},

      ])
    end
  end
end
