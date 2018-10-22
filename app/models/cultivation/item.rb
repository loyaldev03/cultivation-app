module Cultivation
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # field :name, type: String
    # field :uom, type: String
    field :quantity, type: BigDecimal

    embedded_in :task, class_name: 'Cultivation::Task'

    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :uom, class_name: 'Common::UnitOfMeasure', inverse_of: nil
  end
end
