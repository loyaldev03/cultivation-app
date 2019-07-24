module Charts
  class QueryIssueByGroup
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batches = Cultivation::Batch.where(facility_id: @args[:facility_id])
      issues = Issues::Issue.in(cultivation_batch_id: batches.map { |a| a.id.to_s })
      issues = issues.group_by { |a| a.issue_type }
      issues_json = issues.map do |a, b|
        {
          issue_type: a,
          issues: generate_issues_with_date(b),
        }
      end
      issues_json
    end

    private

    def generate_issues_with_date(b)
      arr = []
      (Date.current.beginning_of_month..Date.current.end_of_month).each do |date|
        arr << {
          date: date,
          issue_count: b.select { |v| v.created_at.strftime('%F') == date.to_s }.count,
        }
      end
      arr
    end
  end
end
