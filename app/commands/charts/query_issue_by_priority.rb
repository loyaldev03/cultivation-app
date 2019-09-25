module Charts
  class QueryIssueByPriority
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      batches = Cultivation::Batch.in(facility_id: @facility_id).pluck(:id)

      if RoleCheck.call(@user, Constants::APP_MOD_ALL_ISSUES).result[:read] == true
        issues = Issues::Issue.where(is_archived: false)
      elsif RoleCheck.call(@user, Constants::APP_MOD_ISSUES_REPORTED_BY_MY_DIRECT_REPORTS).result[:read] == true
        u_ids = search_manager(@user.id).map { |x| x[:_id] }
        issues = Issues::Issue.in(reported_by_id: u_ids.push(@user.id), is_archived: false)
      else
        issues = Issues::Issue.where(reported_by_id: @user.id, is_archived: false)
      end

      issues = issues.in(cultivation_batch_id: batches).
        includes(:cultivation_batch, :reported_by, :task, :assigned_to, :resolved_by).group_by { |a| a.severity }

      issues.map do |a, b|
        {
          priority: a,
          count: b.count,
        }
      end
    end

    def search_manager(u_id)
      User.collection.aggregate([
        {"$match": {"reporting_manager_id": u_id.to_bson_id}},
        {"$project": {
          "_id": 1,
        }},
      ]).to_a
    end
  end
end
