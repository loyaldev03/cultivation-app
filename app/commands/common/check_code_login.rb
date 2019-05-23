module Common
  class CheckCodeLogin
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      if @args[:login_code] == @user.login_code
        if @user.login_code_expired_at >= Time.now # code still valid < 5minutes
          true
        else
          errors.add(:login_code, 'Code you entered expired')
        end
      else
        errors.add(:login_code, 'Code you entered wrong')
      end
    end
  end
end
