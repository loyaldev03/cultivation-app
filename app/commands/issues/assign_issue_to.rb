module Issues
  class AssignIssueTo
    prepend SimpleCommand
    attr_reader :current_user,
                :args,
                :id,
                :users

    def initialize(current_user, args)
      @id = args[:id]
      @users = args[:users]
    end

    def call
      return nil unless (valid_user? && valid_data?)

      issue = Issues::Issue.find(id)
      issue.followers = users.uniq
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
