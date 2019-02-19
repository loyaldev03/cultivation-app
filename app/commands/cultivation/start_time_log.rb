module Cultivation
  class StartTimeLog
    prepend SimpleCommand

    def initialize(task_id, args = {})
      @task = Cultivation::Task.find(task_id)
      @work_day = @task.work_days.last
      # @work_day = @task.work_days.find_or_create_by!(date: params[:date], user: current_user)
      @args = args
    end

    def call
      if validate?
        @work_day.update(aasm_state: 'started')
        time_log = @work_day.time_logs.new(start_time: Time.now) #create new time_logs
        time_log.save
        @work_day
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate?
      @task.present? and status_include?
    end

    def status_include?
      status_allowed = ['new', 'stopped', 'stuck', 'started']
      status_allowed.include?(@work_day.aasm_state)
    end
  end
end
