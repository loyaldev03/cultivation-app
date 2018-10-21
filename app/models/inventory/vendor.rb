module Inventory
  class Vendor
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :vendor_no, type: String
    field :address, type: String
    field :state_license_num, type: String
    field :state_license_expiration_date, type: DateTime
    field :location_license_expiration_date, type: DateTime
    field :location_license_num, type: String
    field :vendor_type, type: String, default: 'normal'    # 'plant_supplier', normal
    field :default_terms, type: String
    field :status, type: String, default: 'draft'    # { draft, active }
    field :notes, type: String

    embeds_many :addresses, as: :addressable, class_name: 'Address'
    has_many :purchase_orders, class_name: 'Inventory::PurchaseOrder'
    has_many :invoices, class_name: 'Inventory::VendorInvoice'
  end
end
