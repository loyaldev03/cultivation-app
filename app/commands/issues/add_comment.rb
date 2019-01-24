module Issues
  class AddComment
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :message,
                :quote,
                :issue_id,
                :attachments

    def initialize(current_user, args)
      @current_user = current_user
      @args = args
      @message = args[:message]
      @issue_id = args[:id]
      @attachments = args[:attachments]
    end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(issue_id)
      comment = issue.comments.create!(
        message: message,
        created_by: current_user,
      )
      save_attachments(comment)
      comment
    end

    # TODO: need to check
    def save_attachments(comment)
      attachments.each do |attachment|
        if attachment[:id].blank?
          new_file = comment.comment_attachments.build
          new_file.file = attachment[:data] # <json string>
          new_file.save!
        end
      end
    end

    def valid_user?
      true
    end

    def valid_data?
      errors.add(:message, 'Comment cannot be empty') if args[:message].blank?
      errors.empty?
    end
  end
end
