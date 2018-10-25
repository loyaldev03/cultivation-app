module Inventory
  class PurchaseOrderItem
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :product_name, type: String
    field :description, type: String
    field :manufacturer, type: String
    field :quantity, type: BigDecimal, default: 0.0
    field :price, type: BigDecimal, default: 0.0
    field :currency, type: String, default: 'USD'
    field :tax, type: BigDecimal, default: 0.0
    field :uom, type: String

    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue', inverse_of: nil
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true, inverse_of: nil

    def total_amount
      quantity * price * (1 + tax)
    end
  end
end
