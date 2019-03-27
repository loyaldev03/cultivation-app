module Cultivation
  class WorkDay
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :user_id, type: BSON::ObjectId
    field :date, type: Date
    field :is_done, default: -> { false } # indicate the task is done for the day
    field :duration, type: Integer, default: 0 # in seconds
    field :aasm_state

    validates_presence_of :user_id, :date
    validates_uniqueness_of :user_id, scope: :date # one record per user per day of work

    embedded_in :task
    belongs_to :user

    # Non batch related tasks may exists and they incure material used & waste, time used.
    embeds_many :notes, class_name: 'Cultivation::TaskLog::Note'
    embeds_many :time_logs, class_name: 'Cultivation::TaskLog::TimeLog'
    embeds_many :materials_used, class_name: 'Cultivation::TaskLog::MaterialUsed'
    embeds_many :materials_wasted, class_name: 'Cultivation::TaskLog::MaterialWasted'

    def batch
      task.batch
    end

    private

    def log_timer
      latest_active_time_log&.stop!
      time_logs.create(start_time: Time.now)
    end

    def clear_timer
      latest_active_time_log&.stop!
      set_total_duration
    end

    def set_done
      latest_active_time_log&.stop!
      set_total_duration
      self.is_done = true
      save
    end

    def latest_active_time_log
      time_logs.find_by(end_time: nil)
    end

    def set_total_duration
      self.duration = time_logs.map(&:duration_in_seconds).compact.sum
      save
    end
  end
end
