module Cultivation
  module TaskLog
    class MaterialUsed
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :quantity, type: BigDecimal, default: 0

      belongs_to :item, class_name: 'Inventory::Item'
      belongs_to :uom, class_name: 'Common::UnitOfMeasure'

      embedded_in :work_day, class_name: 'Cultivation::WorkDay'
    end
  end
end
