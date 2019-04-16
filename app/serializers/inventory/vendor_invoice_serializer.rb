module Inventory
  class VendorInvoiceSerializer
    include FastJsonapi::ObjectSerializer
    belongs_to :vendor, class_name: 'Inventory::Vendor'

    attributes :invoice_no,
      :total_amount,
      :status,
      :purchase_date,
      :purchase_order_no

    attribute :purchase_date do |object|
      object.invoice_date.blank? ? '' : object.invoice_date.iso8601
    end
  end
end
