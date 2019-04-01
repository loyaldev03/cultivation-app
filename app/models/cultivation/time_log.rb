module Cultivation
  class TimeLog
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :start_time, type: DateTime
    field :end_time, type: DateTime

    belongs_to :task, class_name: 'Cultivation::Task'
    belongs_to :user, class_name: 'User'

    validates_presence_of :start_time

    def stop!
      self.end_time = Time.now
      save
    end

    def duration_in_seconds
      return 0 if end_time.nil?
      end_time.to_i - start_time.to_i
    end

    def duration_in_minutes
      duration_in_seconds / 60
    end
  end
end
