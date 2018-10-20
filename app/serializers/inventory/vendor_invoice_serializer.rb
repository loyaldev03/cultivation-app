module Inventory
  class VendorInvoiceSerializer
    include FastJsonapi::ObjectSerializer
    belongs_to :vendor

    attributes :invoice_no,
      :total_amount,
      :status,
      :purchase_date,
      :purchase_order_no

    attribute :purchase_date do |object|
      object.purchase_date.blank? ? '' : object.purchase_date.iso8601
    end
  end
end
