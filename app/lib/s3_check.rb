require 'aws-sdk-s3'

class S3Check
  class << self
    def check
      # Configure aws client
      akid = Rails.env.production? ?
        ENV['AWS_ACCESS_KEY_ID'] :
        Rails.application.credentials.aws[:access_key_id]

      secret = Rails.env.production? ?
        ENV['AWS_SECRET_ACCESS_KEY'] :
        Rails.application.credentials.aws[:secret_access_key]

      region = Rails.env.production? ?
        ENV['AWS_REGION'] :
        'ap-southeast-1'

      bucket = Rails.env.production? ?
        ENV['AWS_BUCKET'] :
        'dev.cannected.com'

      Aws.config.update({
        region: region,
        credentials: Aws::Credentials.new(akid, secret),
      })

      s3 = Aws::S3::Client.new

      key = SecureRandom.alphanumeric
      body = SecureRandom.alphanumeric

      s3.put_object(bucket: bucket, key: key, body: body)
      s3.delete_objects(bucket: bucket, delete: {objects: [{key: key}]})

      return true
    rescue => err
      pp err
      return false
    end
  end
end
