HealthCheck.setup do |config|
  # uri prefix (no leading slash)
  config.uri = 'health_check'

  # Text output upon success
  config.success = 'success'

  # Timeout in seconds used when checking smtp server
  config.smtp_timeout = 30.0

  # You can customize which checks happen on a standard health check,
  # E.g. to set an explicit list use:
  config.standard_checks = ['database', 'redis', 'aws-s3']

  # You can set what tests are run with the 'full' or 'all' parameter
  config.full_checks = ['database',
                        'cache',
                        'redis',
                        'sidekiq-redis',
                        'aws-s3',
                        'nexmo',
                        'onesignal']

  config.add_custom_check('aws-s3') do
    res = S3Check.check
    if res == true
      ""
    else
      res
    end
  end

  config.add_custom_check('nexmo') do
    res = NexmoCheck.check
    if res == true
      ""
    else
      res
    end
  end

  config.add_custom_check('onesignal') do
    res = OnesignalCheck.check
    if res == true
      ""
    else
      res
    end
  end

  # max-age of response in seconds
  # cache-control is public when max_age > 1 and basic_auth_username is not set
  # You can force private without authentication for longer max_age by
  # setting basic_auth_username but not basic_auth_password
  config.max_age = 1
end
