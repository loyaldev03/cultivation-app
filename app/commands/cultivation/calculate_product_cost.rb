
module Cultivation
  class CalculateProductCost
    prepend SimpleCommand
    attr_reader :current_user, :task_id, :task

    def initialize(current_user, task_id)
      @current_user = current_user
      @task_id = task_id
      @task = Cultivation::Task.find(task_id)
    end

    def call
      task.estimated_material_cost = get_estimated_material_cost(task)
      task.actual_material_cost = get_actual_material_cost(task)
      task.save!
    end

    def get_actual_material_cost(task)
      costs = []
      task.material_use.each do |item|
        # Sum of both waste and actual used, tx.event_type in (material_used, material_waste)
        tx = Inventory::ItemTransaction.find_by(ref_type: 'Cultivation::Item', ref_id: item.id)
        if (tx)
          uom = tx.common_uom
          qty = tx.common_quantity
          cost = tx.common_quantity * tx.product.average_price
          costs << cost
        end
      end
      costss.sum()
    end

    # On save task
    # For each task, loop material used
    #   -> take the product, uom & quantity
    #   -> product.average_price x normalised quantity = total cost per product
    def get_estimated_material_cost(task)
      est_material_cost = task.material_use.map do |item|
        common_uom = item.product.common_uom
        average_unit_cost = item.product.average_unit_cost

        material_quantity = UOM.for(item.uom_dimension, item.quantity, item.uom).to(common_uom)
        cost = material_quantity * average_price
      end
      est_material_cost.sum()
    end
  end
end
