module Issues
  class AssignIssueFollowers
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :id,
                :followers

    def initialize(current_user, args)
      @id = args[:id]
      @user_id = args[:user]
    end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(id)
      user = User.find(user_id)
      issue.assigned_to = user
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
