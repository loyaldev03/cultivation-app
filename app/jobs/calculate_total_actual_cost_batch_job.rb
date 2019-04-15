class CalculateTotalActualCostBatchJob < ApplicationJob
  queue_as :low

  def perform(batch_id) # use for calculating total actual cost and hour for batch
    @batch = Cultivation::Batch.find(batch_id)
    @tasks = @batch.tasks

    sum_hours = 0.0
    sum_cost = 0.0

    @tasks.each do |task|
      sum_cost += task.actual_cost
      sum_hours += task.actual_hours
    end
    @batch.update(actual_cost: sum_cost.round(2), actual_hours: sum_hours.round(2))
  end
end
