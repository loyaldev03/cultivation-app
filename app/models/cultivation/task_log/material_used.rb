module Cultivation
  module TaskLog
    class MaterialUsed
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :quantity, type: BigDecimal, default: 0
      field :item_id, type: BSON::ObjectId  # optional when using materials not planned
      field :uom, type: String  # TODO: UOM has to be string since its hardcoded for now
      belongs_to :raw_material, class_name: 'Inventory::RawMaterial'

      embedded_in :work_day, class_name: 'Cultivation::WorkDay'

      def item
        work_day.task.items.find_by(id: item_id)
      end
    end
  end
end
