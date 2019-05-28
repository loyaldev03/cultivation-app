module Common
  class RemoveOnesignalNotification
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      uri = URI.parse("https://onesignal.com/api/v1/notifications/#{@args[:one_signal_id]}?app_id=#{ENV['ONE_SIGNAL_APP_ID']}")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Delete.new(uri.path, 'Authorization' => "Basic #{ENV['ONE_SIGNAL_API_KEY']}")
      response = http.request(request)
      if response.kind_of? Net::HTTPSuccess
        JSON.parse(response.body)
      else
        # errors.add(:)
      end
    end
  end
end
