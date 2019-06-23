module DailyTask
  class SaveMaterialUsage
    prepend SimpleCommand

    attr_reader :current_user, :task_id, :material_used_id, :actual, :waste, :date

    def initialize(current_user, task_id, date, material_used_id, actual, waste)
      @current_user = current_user
      @task_id = task_id.to_s

      # Because we are not doing additive entry, so have to force all entry
      # from same day to overide each other.
      @date = date
      @material_used_id = material_used_id.to_s
      @actual = -actual.to_d
      @waste = -waste.to_d
    end

    def call
      Rails.logger.debug "\t\t>>>>> SaveMaterialUsage called"
      if valid_user? && valid_params?
        task = Cultivation::Task.find_by(id: task_id)
        material_use = task.material_use.find(id: material_used_id)
        actual_tx = nil
        waste_tx = nil

        if material_use.present?
          if actual < 0
            actual_tx = create_transaction('material_used', task, material_use, actual, material_use.uom)
            actual_tx.save!
          end

          if waste < 0
            waste_tx = create_transaction('material_waste', task, material_use, waste, material_use.uom)
            waste_tx.save!
          end
        end

        # TASK 980
        update_material_cost(material_use)

        [actual_tx, waste_tx].compact
      end
    end

    private

    # TASK 980
    def update_material_cost(material_use)
      # In order to reduce mistake from race condition / parallel task, the
      # code loops through all material used under the task and update the cost again.
      task = material_use.task
      sub_totals = task.material_use.map do |mu|
        # For each item under the task, convert all unit to standard unit
        # sum all numbers
        # update sum back to task actual_material_cost
        txs = Inventory::ItemTransaction.where(ref_id: mu.id, ref_type: 'Cultivation::Item')
        next if txs.empty?

        total_material = txs.sum(:common_quantity) # Naively assume it is same unit
        price = txs.first.product.average_price
        sub_total = (total_material * price).abs         # TODO: Ensure the cost is positive or change it to be so!
        sub_total
      end

      task.actual_material_cost = sub_totals.compact.sum
      task.save!
    end

    def create_transaction(event_type, task, material_use, quantity, uom)
      tx = Inventory::ItemTransaction.find_or_initialize_by(
        event_date: date,
        ref_id: material_used_id,
        ref_type: 'Cultivation::Item',
        event_type: event_type,
        product: material_use.product,
        catalogue: material_use.product.catalogue,
        cultivation_batch: task.batch,
        facility: task.batch ? task.batch.facility : material_use.product.facility,
      )

      tx.quantity = quantity
      tx.uom = uom
      tx
    end

    def valid_user?
      true
    end

    def valid_params?
      if current_user.nil?
        errors.add(:error, 'Missing param :current_user')
        return false
      end

      if material_used_id.nil?
        errors.add(:error, 'Missing param :material_used_id')
        return false
      end
      true
    end
  end
end
