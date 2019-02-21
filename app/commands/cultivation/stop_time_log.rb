module Cultivation
  class StopTimeLog
    prepend SimpleCommand

    def initialize(user_id, task_id, args = {})
      @task = Cultivation::Task.find(task_id)
      @user = User.find(user_id)
      @args = args
    end

    def call
      if validate?
        @task.time_logs.find_by(end_time: nil).stop!
        duration = @task.time_logs.map(&:duration_in_seconds).compact.sum
        @task.update(work_status: 'stopped', duration: duration)
        @task
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate?
      @task.present? #and status_include?
    end

    def status_include?
      status_allowed = ['started']
      status_allowed.include?(@work_day.aasm_state)
    end
  end
end
