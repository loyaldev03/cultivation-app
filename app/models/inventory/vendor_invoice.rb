module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    DRAFT = 'draft'
    SUBMITTED = 'submitted'
    PAID = 'paid'
    INVENTORY_SETUP = 'inventory_setup'

    field :invoice_no, type: String
    field :invoice_date, type: DateTime
    field :status, type: String          # {draft, submitted, paid, inventory_setup}
    field :terms_in_days, type: Integer, default: 0

    belongs_to :facility, class_name: 'Facility'
    belongs_to :vendor, class_name: 'Inventory::Vendor'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
    has_many :items, class_name: 'Inventory::VendorInvoiceItem', dependent: :destroy

    def total_amount
      items.sum { |x| x.total_amount }
    end
  end
end
