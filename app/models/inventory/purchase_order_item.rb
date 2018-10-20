module Inventory
  class PurchaseOrderItem
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :description, type: String
    field :quantity, type: BigDecimal, default: 0.0
    field :price, type: BigDecimal, default: 0.0
    field :currency, type: String
    field :tax, type: BigDecimal, default: 0.0

    belongs_to :uom, class_name: 'Common::UnitOfMeasure', optional: true
    belongs_to :item_catalgoue, class_name: 'Inventory::ItemCatalogue'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
  end
end
