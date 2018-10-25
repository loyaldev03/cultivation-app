module Cultivation
  module TaskLog
    class MaterialWasted
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :quantity, type: BigDecimal, default: 0
      field :uom, type: String

      belongs_to :item, class_name: 'Inventory::Item'

      embedded_in :work_day, class_name: 'Cultivation::WorkDay'
    end
  end
end
