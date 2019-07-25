module Charts
  class IssueList
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      json_array = []
      Issues::Issue.includes(:cultivation_batch).all.map do |issue|
        if issue.cultivation_batch.facility_id == @args[:facility_id]
          json_array << {
            id: issue.id.to_s,
            issue_no: issue.issue_no,
            batch: issue&.cultivation_batch&.batch_no,
            batch_id: issue&.cultivation_batch_id&.to_s,
            created_at: issue.c_at.strftime('%-d %B, %-l.%M %P'),
            status: issue.status,
            title: issue.title,
          }
        end
      end
      json_array
    end
  end
end
