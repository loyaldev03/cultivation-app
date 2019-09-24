require 'aws-sdk-s3'

class NexmoCheck
  class << self
    def check
      client = Nexmo::Client.new(
        api_key: Rails.application.credentials.nexmo[:api_key],
        api_secret: Rails.application.credentials.nexmo[:api_secret],
      )
      res = client.applications.list
      return true
    rescue => err
      return err.to_s
    end
  end
end
