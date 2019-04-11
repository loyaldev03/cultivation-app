module Inventory
  class VendorInvoiceItem
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :product_name, type: String
    field :description, type: String
    field :manufacturer, type: String
    field :quantity, type: Float, default: -> { 0 }
    field :price, type: Float, default: -> { 0 }
    field :currency, type: String, default: 'USD'
    field :tax, type: Float, default: -> { 0 }
    field :uom, type: String

    belongs_to :invoice, class_name: 'Inventory::VendorInvoice', optional: true   # optional to be removed.
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true, inverse_of: nil
    belongs_to :purchase_order_item, class_name: 'Inventory::PurchaseOrderItem', optional: true

    def total_amount
      quantity * price * (1 + tax)
    end
  end
end
