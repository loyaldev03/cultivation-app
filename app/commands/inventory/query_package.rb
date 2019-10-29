module Inventory
  class QueryPackage
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      arr = []
      catalogues = Inventory::Catalogue.where(catalogue_type: 'sales_products', category: 'raw_sales_product').order(label: :asc)
    end
  end
end
