module Common
  class SendOnesignalNotification
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      params = {'app_id' => ENV['ONE_SIGNAL_APP_ID'],
                'contents' => {'en' => @args[:message]},
                'include_external_user_ids' => @args[:user_ids],
                'delayed_option' => 'timezone',
                'delivery_time_of_day' => @args[:time_of_day]&.strftime('%T')}
      uri = URI.parse('https://onesignal.com/api/v1/notifications')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(uri.path,
                                    'Content-Type' => 'application/json;charset=utf-8',
                                    'Authorization' => "Basic #{ENV['ONE_SIGNAL_API_KEY']}")
      request.body = params.as_json.to_json
      response = http.request(request)
      if response.kind_of? Net::HTTPSuccess
        JSON.parse(response.body)
      else
        # errors.add(:)
      end
    end
  end
end
