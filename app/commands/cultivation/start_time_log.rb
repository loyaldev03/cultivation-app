module Cultivation
  class StartTimeLog
    prepend SimpleCommand

    def initialize(user_id, task_id, args = {})
      @task = Cultivation::Task.find(task_id)
      @user = User.find(user_id)
      @args = args
    end

    def call
      if validate?
        @task.update(work_status: 'started')
        time_log = @task.time_logs.new(start_time: Time.now, user: @user) #create new time_logs
        time_log.save
        @task
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate?
      @task.present? #and status_include?
    end

    def status_include?
      status_allowed = ['new', 'stopped', 'stuck', 'started']
      status_allowed.include?(@work_day.aasm_state)
    end
  end
end
