source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.0'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
# gem 'sass-rails', '~> 5.0'
gem 'sassc-rails'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'bootsnap', '>= 1.1.0', require: false

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'pry-byebug', platforms: [:mri] # Use `binding.pry` to invoke pry
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'rspec-rails'

  # Automatically re-run rspec tests
  gem 'spring-commands-rspec'
  gem 'guard-rspec', require: false
  gem 'terminal-notifier-guard'
end

group :test do
  gem 'database_cleaner'
  gem 'email_spec'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  # Ruby code formatter (.rufo)
  gem 'rubocop', '~> 0.57.2', require: false
  gem 'rufo', '~> 0.3.1', require: false

  # Format erb files
  gem 'htmlbeautifier'

  # Quickly switch user during development
  gem 'switch_user'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Frontend
gem 'react-rails'
gem 'webpacker', '~> 4.x'

gem 'country_select'
gem 'simple_form'

# Database
gem 'mongoid', '~> 7.0.2'
gem 'mongoid-history'
gem 'mongoid_orderable'
gem 'mongoid_rails_migrations'
gem 'pagy'

# Check for N+1
gem 'bullet', group: 'development'

# User authentication
gem 'devise'

# Use command pattern to build service classes
gem 'simple_command'

# Performance Profiler (place after mongoid)
gem 'rack-mini-profiler'

# For memory profiling
gem 'memory_profiler'

# For call-stack profiling flamegraphs
gem 'flamegraph'
gem 'stackprof'

# Producation Monitoring
gem 'scout_apm'

# Error tracking
gem 'rollbar'

# Api
gem 'fast_jsonapi'
gem 'rest-client'

# File attachment
gem 'aws-sdk-s3', '~> 1.2'
gem 'shrine', '~> 2.12'
gem 'shrine-mongoid'

# Background Job
gem 'redis'
gem 'sidekiq'
gem 'sidekiq-cron'

# Time travel
gem 'timecop'
gem 'nexmo'

