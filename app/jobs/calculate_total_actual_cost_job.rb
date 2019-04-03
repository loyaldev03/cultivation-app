class CalculateTotalActualCostJob < ApplicationJob
  queue_as :default

  def perform(task_id)
    @task = Cultivation::Task.find(task_id)
    sum_cost = 0.0
    sum_minutes = 0.0
    @task.time_logs.each do |time_log|
      if time_log.start_time and time_log.end_time
        result = Cultivation::CalculateActualCost.call(time_log.id.to_s).result
        sum_cost += result[:actual_cost]
        sum_minutes += result[:actual_minutes]
      end
    end
    actual_hours = sum_minutes / 60
    @task.update(actual_cost: sum_cost.round(2), actual_hours: actual_hours.round(2))
  end
end
