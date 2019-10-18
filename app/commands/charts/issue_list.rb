module Charts
  class IssueList
    prepend SimpleCommand

    IssueInfo = Struct.new(:id, :issue_no, :cultivation_batch_id, :severity, :c_at, :status, :title, :batch_no)

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      issues = Issues::Issue.collection.aggregate([
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
          cultivation_batch_id: 1,
          severity: 1,
          c_at: 1,
          status: 1,
          title: 1,
          batch_no: '$batch.batch_no',
        }},

      ])
      json_array = []

      issues.each do |x|
        json_array << IssueInfo.new(
          x[:_id],
          x[:issue_no],
          x[:cultivation_batch_id]&.to_s,
          x[:severity],
          x[:c_at],
          x[:status],
          x[:title],
          x[:batch_no]
        )
      end

      return json_array
    end
  end
end
