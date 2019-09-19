module Issues
  class QueryReportedIssues
    prepend SimpleCommand

    attr_reader :task_id, :filter_status

    def initialize(current_user, facility_id)
      @user = current_user
      @f_ids = facility_id.split(',').map { |x| x.to_bson_id }
    end

    def call
      u_ids = search_manager(@user.id).map { |x| x[:_id] }
      b_ids = search_facility_batches(@f_ids).map { |x| x[:_id] }
      Issues::Issue.in(reported_by_id: u_ids, cultivation_batch_id: b_ids, is_archived: false).
        includes(:cultivation_batch, :reported_by, :task, :assigned_to, :resolved_by)
    end

    def search_manager(u_id)
      User.collection.aggregate([
        {"$match": {"reporting_manager_id": u_id}},
        {"$project": {
          "_id": 1,
        }},
      ]).to_a
    end

    def search_facility_batches(f_id)
      batches = Cultivation::Batch.collection.aggregate([
        {"$match": {"facility_id": {"$in": f_id}}},
        {"$project": {
          "_id": 1,
        }},
      ]).to_a
    end
  end
end
