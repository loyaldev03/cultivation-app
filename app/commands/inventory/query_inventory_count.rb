# This class provides latest count for all inventory inside a facility
# except for plants. Result returned
module Inventory
  class QueryInventoryCount
    prepend SimpleCommand

    attr_reader :facility_id

    def initialize(facility_id)
      @facility_id = facility_id
    end

    def call
      catalogue_ids = Inventory::Catalogue.where(
        uom_dimension: {"$nin": ['', nil]},
        category: {"$in": [
          Constants::CONVERTED_PRODUCT_KEY,
          'raw_sales_product',
          Constants::SUPPLEMENTS_KEY,
          Constants::NUTRIENTS_KEY,
          Constants::GROW_MEDIUM_KEY,
          Constants::GROW_LIGHT_KEY,
          Constants::OTHERS_KEY,
        ]},
      ).pluck(:id)

      ap = IT.collection.aggregate([
        {"$match": {"catalogue_id": {"$in": catalogue_ids}, "facility_id": facility_id}},
        # TODO:
        # - For sales product, group by product tag and sum quantity to include all addition & deduction
        # - For raw material, group by product and sum quantity

        {"$lookup": {from: 'inventory_products', localField: 'product_id', foreignField: '_id', as: 'product'}},
      ])

      ap
    end
  end
end
