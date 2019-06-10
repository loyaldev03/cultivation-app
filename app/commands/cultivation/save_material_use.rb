module Cultivation
  class SaveMaterialUse
    prepend SimpleCommand

    attr_reader :current_user, :id, :items

    def initialize(current_user, id, items, water_ph)
      @current_user = current_user
      @id = id.to_bson_id
      @items = items
      @water_ph = water_ph
    end

    def call
      task = save_record

      # TASK 980
      # update_estimated_cost(task)

      # TASK 980
      # update_cost_of_batch(task.batch_id)
      task
    end

    private

    def save_record
      record = Cultivation::Task.find(id)
      record.material_use = []
      record.water_ph = @water_ph
      items.each do |item|
        product = Inventory::Product.find(item[:product_id])
        catalogue = product.catalogue
        record.material_use.build(
          product_id: item[:product_id],
          quantity: item[:quantity],
          uom: item[:uom],
          catalogue: catalogue.key,
        )
      end
      record.save
      record
    rescue
      errors.add(:error, $!.message)
    end

    # TASK 980
    def update_estimated_cost(task)
      return # Temporarily commented out

      # In order to reduce mistake from race condition / parallel task, the
      # code loops through all material used under the task and update the cost again.
      sub_totals = task.material_used.each do |mu|
        # For each item under the task, convert all unit to standard unit
        # sum all numbers
        # update sum back to task actual_material_cost
        price = mu.product.average_price
        sub_total = mu.common_quantity * price # TODO: Ensure the cost is positive or change it to be so!
        sub_total
      end

      task.estimated_material_cost = sub_totals.compact.sum
      task.save!
    end

    def update_cost_of_batch(batch_id)
      batch = Cultivation::Batch.find(batch_id)
      estimated_material_cost = 0
      estimated_worker_cost = 0

      batch.tasks.each do |x|
        estimated_material_cost += (x.estimated_material_cost || 0)
        estimated_worker_cost += (x.estimated_worker_cost || 0)
      end

      batch.update!(estimated_cost: (estimated_material_cost + estimated_worker_cost))
    end
  end
end
