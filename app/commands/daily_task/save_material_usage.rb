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

        [actual_tx, waste_tx].compact
      end
    end

    private

    def create_transaction(event_type, task, material_use, quantity, uom)
      tx = Inventory::ItemTransaction.find_or_initialize_by(
        event_date: date,
        ref_id: material_used_id,
        ref_type: 'Cultivation::Item',
        event_type: event_type,
        product: material_use.product,
        catalogue: material_use.product.catalogue,
        cultivation_batch: task.batch,
        facility: task.batch.facility,
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
