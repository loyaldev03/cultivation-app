module Common
  class GenerateCodeLogin
    prepend SimpleCommand

    def initialize(user, args = {})
      @user = user
      @args = args
    end

    def call
      generated_code = ('%04d' % rand(0..9999)).to_s
      generated_code_expired_at = Time.current.end_of_day
      @user.update(
        login_code: generated_code,
        login_code_expired_at: generated_code_expired_at,
      )
      sms_message = "Your OTP is #{generated_code}"

      cmd = Common::SendSmsCode.call(phone_number: @user.phone_number,
                                     message: sms_message)
    end
  end
end
