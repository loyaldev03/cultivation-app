module Common
  class SendSmsCode
    prepend SimpleCommand

    def initialize(args = {})
      @phone_number = args[:phone_number]
      @message = args[:message]
    end

    def call
      from = ENV['MAILER_URL_HOST'] || 'Cannected.com'
      @client = initialize_nextmo
      res = @client.sms.send(
        from: from,
        to: @phone_number,
        text: @message,
      )
      if !res.messages.blank?
        err_msgs = res.messages.map(&:error_text).join('. ')
        raise StandardError.new "#{@phone_number}: #{err_msgs}"
      end
      res
    end

    private

    def initialize_nextmo
      Nexmo::Client.new(
        api_key: Rails.application.credentials.nexmo[:api_key],
        api_secret: Rails.application.credentials.nexmo[:api_secret],
      )
    end
  end
end
