module Charts
  class IssueList
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
    end

    def call
      json_array = []
      batch_ids = Cultivation::Batch.in(facility_id: @facility_id).pluck(:id)
      issues = Issues::Issue.in(cultivation_batch_id: batch_ids)

      issues.each do |issue|
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

      json_array
    end
  end
end
