module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :invoice_no, type: String
    field :total_amount, type: BigDecimal
    field :plants, type: Array
    field :status, type: String

    # has_many :item_articles
    # has_many :items

    belongs_to :vendor, class_name: 'Inventory::Vendor'
    # has_many   :plants, class_name: 'Inventory::Plants'

    # TODO: This is missing or to be added...
    # An invoice
    #   has many invoice_items:
    #     1. item price, qty, tax ---> link_to ---> item & article items[]
    #     2. item price, qty, tax ---> link_to ---> item & article items[]
  end
end
