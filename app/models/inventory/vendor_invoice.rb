module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :invoice_no, type: String
    field :invoice_date, type: DateTime
    field :status, type: String          # {draft, submitted, paid}
    field :terms_in_days, type: Integer, default: 0

    belongs_to :facility
    belongs_to :vendor, class_name: 'Inventory::Vendor'
    belongs_to :purchase_order, class_name: 'Inventory::PurchaseOrder'
    has_many :items, class_name: 'Inventory::VendorInvoiceItem', dependent: :delete

    def total_amount
      items.sum { |x| x.total_amount }
    end
  end
end
