module Charts
  class QueryWorkerCapacity
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batch = Cultivation::Batch.find(@args[:batch_id])
      phases = Common::GrowPhase.active.map { |a| a.name.downcase }
      tasks = batch.tasks.includes(:time_logs, :users)
      result = []
      i = 0
      phases.each do |phase|
        count_actual_worker = 0
        count_planned_worker = 0

        tasks.where(phase: phase).each do |task|
          count_actual_worker += 1 if task.time_logs.count > 0
          count_planned_worker += task.users.count if task.users.count > 0
        end
        i += 1
        result << {
          actual: count_actual_worker,
          needed: count_planned_worker,
          stage: phase,
          actualColor: '#f86822',
          neededColor: '#4a65b3',
          index: i,
        }
      end
      result
    end
  end
end
