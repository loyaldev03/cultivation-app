module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :invoice_no, type: String
    field :invoice_date, type: DateTime
    field :status, type: String          # {draft, submitted, paid}

    # To be removed
    # field :purchase_date,     type: DateTime
    # field :purchase_order_no, type: String

    belongs_to :facility
    belongs_to :vendor, class_name: 'Inventory::Vendor'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'

    has_many :items, class_name: 'Inventory::VendorInvoiceItem', dependent: :delete
    # TODO: To be moved to vendor invoice item!
    has_many :plants, class_name: 'Inventory::Plant', dependent: :nullify

    def total_amount
      0
    end
  end
end
