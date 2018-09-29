module Cultivation
  module WorkLog
    class MaterialUsed
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :quantity, type: BigDecimal, default: 0

      belongs_to :item, class_name: 'Inventory::Item'
      belongs_to :uom, class_name: 'Common::UnitOfMeasure'

      embedded_in :work_log, class_name: 'Cultivation::WorkLog::Log'
    end
  end
end
