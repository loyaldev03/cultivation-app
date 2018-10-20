module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :invoice_no, type: String
    field :total_amount, type: BigDecimal
    field :status, type: String
    field :purchase_date, type: DateTime
    field :purchase_order_no, type: String

    belongs_to :vendor, class_name: 'Inventory::Vendor'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
    belongs_to :facility

    has_many :items, class_name: 'Inventory::VendorInvoiceItem'
    has_many :plants, class_name: 'Inventory::Plant'        # to be revised!
  end
end
