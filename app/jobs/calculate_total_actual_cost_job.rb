class CalculateTotalActualCostJob < ApplicationJob
  queue_as :default

  def perform(task_id) # use for calculating total actual cost and hour for tasks
    @task = Cultivation::Task.find(task_id)
    sum_cost = 0.0
    sum_minutes = 0.0
    @task.time_logs.includes(:user).each do |time_log|
      if time_log.start_time && time_log.end_time
        result = Cultivation::CalculateTaskActualCostAndHours.call(time_log, time_log.user, true).result #true for calculating the breakdown
        sum_cost += result[:actual_cost]
        sum_minutes += result[:actual_minutes]
      end
    end
    actual_hours = sum_minutes / 60 #convert to hours
    @task.update(actual_labor_cost: sum_cost.round(2), actual_hours: actual_hours.round(2))
  end
end
