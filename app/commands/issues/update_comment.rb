module Issues
  class UpdateComment
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :id,
                :comment_id,
                :message

    def initialize(current_user, args)
      @id = args[:id]
      @comment_id = args[:comment_id]
      @message = args[:message]
    end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(id)
      issue.comments.find(id: comment_id).update!(message: message)
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
