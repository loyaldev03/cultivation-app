module Inventory
  class VendorInvoiceItem
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

    belongs_to :invoice, class_name: 'Inventory::VendorInvoice'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true, inverse_of: nil

    def total_amount
      quantity * price * (1 + tax)
    end
  end
end
