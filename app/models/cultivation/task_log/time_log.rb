module Cultivation
  module TaskLog
    class TimeLog
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :start_time, type: DateTime
      field :end_time, type: DateTime

      # embedded_in :work_day, class_name: 'Cultivation::WorkDay'
      belongs_to :task_detail, class_name: 'Cultivation::TaskDetail'
      validates_presence_of :start_time

      def stop!
        self.end_time = Time.now
        save
      end

      def duration_in_seconds
        return 0 if end_time.nil?
        end_time.to_i - start_time.to_i
      end
    end
  end
end
