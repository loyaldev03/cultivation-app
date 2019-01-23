module Issues
  class AddComment
    prepend SimpleCommand
    attr_reader :current_user,
                :message,
                :quote,
                :issue_id,
                :attachments

    def initialize(current_user, args)
      @current_user = current_user
      @message = args[:message]
      @issue_id = args[:id]
    end

    def call
      return nil unless (valid_user? && valid_data?)

      # Rails.logger.debug "\t\t\t>>>>>> AddComment.current_user: #{current_user.inspect}"

      issue = Issues::Issue.find(issue_id)
      comment = issue.comments.create!(
        message: message,
        created_by: current_user,
      )
      # TODO: attachments...
      comment
    end

    def valid_user?
      true
    end

    def valid_data?
      true
    end
  end
end
