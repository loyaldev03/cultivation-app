module DailyTask
  class DoneTask
    prepend SimpleCommand

    def initialize(user_id, task_id, args = {})
      @task = Cultivation::Task.find(task_id)
      @user = User.find(user_id)
      @args = args
    end

    def call
      if validate?
        last_time_log = @task.time_logs.find_by(end_time: nil)
        last_time_log.stop! if last_time_log
        @task.update(work_status: 'done')
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
