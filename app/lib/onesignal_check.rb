class OnesignalCheck
  class << self
    def check
      # Configure aws client
      app_id = ENV['ONE_SIGNAL_APP_ID']
      api_key = ENV['ONE_SIGNAL_API_KEY']

      if !Rails.env.production?
        app_id = ENV['ONE_SIGNAL_APP_ID'] ||
                 Rails.application.credentials.onesignal[:app_id]

        api_key = ENV['ONE_SIGNAL_API_KEY'] ||
                  Rails.application.credentials.onesignal[:api_key]
      end

      uri = URI.parse("https://onesignal.com/api/v1/players?app_id=#{app_id}&limit=1&offset=0")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      pp uri.request_uri
      request = Net::HTTP::Get.new(uri.request_uri)
      request['Authorization'] = "Basic #{api_key}"
      request['Content-Type'] = 'application/json'

      response = http.request(request)

      body = JSON.parse(response.body)
      body['errors'].blank? ? true : body['errors'].join
    end
  end
end
