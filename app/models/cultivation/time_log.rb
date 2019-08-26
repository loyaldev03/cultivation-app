module Cultivation
  class TimeLog
    #FOR TASK LOG START TIME, END TIME

    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :start_time, type: Time
    field :end_time, type: Time
    field :status, type: String # late , on-time

    belongs_to :task, class_name: 'Cultivation::Task'
    belongs_to :user, class_name: 'User'

    validates_presence_of :start_time

    embeds_many :breakdowns, class_name: 'Cultivation::Breakdown'

    def stop!
      self.end_time = Time.current
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
