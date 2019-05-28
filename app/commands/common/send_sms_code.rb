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
        api_key: ENV['NEXTMO_API_KEY'],
        api_secret: ENV['NEXTMO_API_SECRET'],
      )
    end
  end
end
