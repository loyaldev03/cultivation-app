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
      return 0 if end_time.nil?
      (duration_in_seconds / 1.minutes).round(2)
    end

    def duration_in_hours
      return 0 if end_time.nil?
      ((end_time.to_f - start_time.to_f) / 1.hours).round(2)
    end
  end
end
