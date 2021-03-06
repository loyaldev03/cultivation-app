class CalculateTotalActualCostBatchJob < ApplicationJob
  queue_as :low

  # Calculating total actual cost and actual hour for batch
  def perform(batch_id)
    batch = Cultivation::Batch.find(batch_id)
    batch_tasks = Cultivation::QueryTasks.call(batch).result

    sum_hours = 0.0
    sum_labor_cost = 0.0
    sum_material_cost = 0.0

    batch_tasks.each do |task|
      if !task.have_children?(batch_tasks)
        sum_labor_cost += task.actual_labor_cost
        sum_material_cost += task.actual_material_cost
        sum_hours += task.actual_hours
      end
    end

    batch.update(
      actual_material_cost: sum_material_cost.round(2),
      actual_labor_cost: sum_labor_cost.round(2),
      actual_hours: sum_hours.round(2),
    )
  end
end
