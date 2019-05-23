module Common
  class SendSmsCode
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @message = args[:message]
      @client = initialize_nextmo
    end

    def call
      @client.sms.send(
        from: 'Cannected',
        to: @user.phone_number,
        text: @message,
      )
    end

    private

    def initialize_nextmo
      Nexmo::Client.new(
        api_key: Rails.application.credentials.nextmo[:api_key],
        api_secret: Rails.application.credentials.nextmo[:api_secret],
      )
    end
  end
end
