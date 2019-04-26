module System
  class Configuration
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :current_time, type: Time
    field :enable_time_travel, type: Boolean, default: -> { false }
  end
end
