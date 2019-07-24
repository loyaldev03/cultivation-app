module Charts
  class QueryIssueByPriority
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batches = Cultivation::Batch.where(facility_id: @args[:facility_id])
      issues = Issues::Issue.in(cultivation_batch_id: batches.map { |a| a.id.to_s })
      issues = issues.group_by { |a| a.severity }
      issues.map do |a, b|
        {
          priority: a,
          count: b.count,
        }
      end
    end
  end
end
