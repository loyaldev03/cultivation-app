module Common
  class SendSmsCode
    prepend SimpleCommand

    def initialize(args = {})
      @phone_number = args[:phone_number]
      @message = args[:message]
    end

    def call
      if @phone_number.nil?
        # stop app from crashing when no phone
        return;
      end

      from_name = ENV['SMS_FROM'] || 'Cannected'
      @client = initialize_nextmo
      res = @client.sms.send(
        from: from_name,
        to: @phone_number,
        text: @message,
      )
      if !res.messages.blank? && res.messages[0]&.status != '0'
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
