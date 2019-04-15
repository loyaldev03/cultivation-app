module DailyTask
  class DoneTask
    prepend SimpleCommand

    attr_reader :task_id, :user_id

    def initialize(user_id, task_id)
      @task_id = task_id
      @user_id = user_id
    end

    def call
      if valid_params?
        last_time_log = task.time_logs.find_by(end_time: nil)
        last_time_log&.stop!
        task.update(work_status: 'done')
        CalculateTotalActualCostJob.perform_now(task.id.to_s)
        MovePlantsToNextPhaseJob.perform_later(task.batch_id.to_s)
        task
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    private

    def task
      @task ||= Cultivation::Task.find(task_id)
    end

    def user
      @user ||= User.find(user_id)
    end

    def valid_params?
      if task_id.nil?
        errors.add(:task_id, 'task_id is required')
      end
      if user_id.nil?
        errors.add(:user_id, 'user_id is required')
      end
      errors.empty?
    end
  end
end

