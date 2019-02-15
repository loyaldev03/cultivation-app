module Issues
  class ResolveIssue
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :id,
                :notes,
                :reason

    def initialize(current_user, args)
      @id = args[:id]
      @notes = args[:notes]
      @reason = args[:reason]
      @current_user = current_user
    end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(id)
      issue.status = 'resolved'
      issue.resolution_notes = notes
      issue.reason = reason
      issue.resolved_at = Time.now
      issue.resolved_by = current_user
      issue.save!
      issue
    end

    def valid_user?
      true
    end

    def valid_data?
      true
    end
  end
end
