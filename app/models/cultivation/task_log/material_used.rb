module Cultivation
  module TaskLog
    class MaterialUsed
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :quantity, type: BigDecimal, default: 0
      field :item_id, type: BSON::ObjectId
      field :item_transaction_id, type: BSON::ObjectId
      field :uom, type: String  # TODO: UOM has to be string since its hardcoded for now

      # To be removed
      # belongs_to :item, class_name: 'Inventory::Item'

      belongs_to :catalogue, class_name: 'Inventory::Catalogue'
      embedded_in :work_day, class_name: 'Cultivation::WorkDay'

      def item
        work_day.task.items.find_by(id: item_id)
      end
    end
  end
end
