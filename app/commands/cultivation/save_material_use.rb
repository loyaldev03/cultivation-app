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
      update_estimated_material_cost(task)

      # TASK 980
      # TODO: Trace how batch.estimated_cost is updated.
      #
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
        record.material_use.build(
          product_id: item[:product_id],
          quantity: item[:quantity],
          uom: item[:uom],
          catalogue: product.catalogue.key,
        )
      end
      record.save
      record
    rescue
      errors.add(:error, $!.message)
    end

    def update_estimated_material_cost(task)
      estimated_material_cost = task.material_use.reduce(0) do |sum, mu|
        # TODO: use common_quantity
        sum + (mu.quantity * mu.product.average_price)
      end

      task.estimated_material_cost = estimated_material_cost
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
