module Inventory
  class PurchaseOrderItem
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
    field :product_id, type: BSON::ObjectId

    has_one :invoice_item, class_name: 'Inventory::VendorInvoiceItem'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue', inverse_of: nil
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true, inverse_of: nil

    def total_amount
      quantity * price * (1 + tax)
    end
  end
end
