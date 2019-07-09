# config/initializers/sidekiq.rb
schedule_file = if Rails.env.development?
                  "config/schedule-dev.yml"
                else
                  "config/schedule-prod.yml"
                end

if File.exist?(schedule_file) && Sidekiq.server?
  Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
end

# Perform sidekiq async job immediately in development
if Rails.env.development?
  require 'sidekiq/testing'
  Sidekiq::Logging.logger = Rails.logger
  Sidekiq::Testing.inline!
end

