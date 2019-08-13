module DailyTask
  class DoneTask
    prepend SimpleCommand

    attr_reader :task_id, :user_id

    def initialize(user_id, task_id)
      @task_id = task_id
      @user_id = user_id
    end

    # This is called when a task has been completed by a worker.
    def call
      if valid_params?
        stop_time_logs
        task.update(work_status: Constants::WORK_STATUS_DONE)
        CalculateTotalActualCostJob.perform_later(task.id.to_s)
        MovePlantsToNextPhaseJob.perform_later(task.batch_id.to_s)
        CalculateTotalActualCostBatchJob.perform_later(@task.batch_id.to_s)

        # When clone are moved into trays. Generate PlantBatch
        # for Metrc synchronization.
        if task.indelible == Constants::INDELIBLE_CLIP_POT_TAG ||
           task.indelible == Constants::INDELIBLE_MOVING_TO_TRAY
          GenerateBatchLots.perform_async(task.batch_id.to_s)
        end

        if task.indelible == Constants::INDELIBLE_ADD_NUTRIENT
          MetrcCreateAdditives.perform_async(@task_id)
        end

        task
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    private

    def task
      @task ||= Cultivation::Task.find(task_id)
    end

    def stop_time_logs
      logs = task.time_logs.where(user_id: user.id,
                                  end_time: nil)
      if logs.any?
        logs.each(&:stop!)
      end
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
