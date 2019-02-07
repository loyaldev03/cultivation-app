module Issues
  class DeleteComment
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :id,
                :comment_id,
                def initialize(current_user, args)
                  @id = args[:id]
                  @comment_id = args[:comment_id]
                end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(id)
      issue.comments.find(comment_id).destroy!
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
