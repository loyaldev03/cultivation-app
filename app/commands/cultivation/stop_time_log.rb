module Cultivation
  class StopTimeLog
    prepend SimpleCommand

    def initialize(task_id, args = {})
      @task = Cultivation::Task.find(task_id)
      @work_day = @task.work_days.last
      @args = args
    end

    def call
      if validate?
        @work_day.time_logs.find_by(end_time: nil).stop!
        duration = @work_day.time_logs.map(&:duration_in_seconds).compact.sum
        @work_day.update(aasm_state: 'stopped', duration: duration)
        @work_day
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate?
      @task.present? and status_include?
    end

    def status_include?
      status_allowed = ['started']
      status_allowed.include?(@work_day.aasm_state)
    end
  end
end
