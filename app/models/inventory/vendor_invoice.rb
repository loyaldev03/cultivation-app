module Inventory
  class VendorInvoice
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :invoice_no, type: String
    field :total_amount, type: BigDecimal
    field :items, type: Array
    field :item_articles, type: Array
    field :status, type: String
    belongs_to :vendor

    # TODO: This is missing or to be added...
    # An invoice
    #   has many invoice_items:
    #     1. item price, qty, tax ---> link_to ---> item & article items[]
    #     2. item price, qty, tax ---> link_to ---> item & article items[]
  end
end
