module Cultivation
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :quantity, type: BigDecimal
    field :uom, type: String

    embedded_in :task, class_name: 'Cultivation::Task'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'

    def name
      catalogue.try(:label)
    end
  end
end
