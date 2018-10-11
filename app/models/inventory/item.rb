module Inventory
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :sku, type: String
    field :item_type, type: String    # Possible values: plant, waste, harvest, seed, storage, raw_materials, sales, non_sales, others
                                      #
                                      # Note:
                                      # Anything related to a strain should use item_type either plant, waste or harvest.
                                      # Use 'plant' when it is an active plant.
                                      # Use 'seed' when the it has not germinated. Seed is a special kind of raw material.

    field :has_serial_no, type: Boolean, default: false
    field :description, type: String
    field :quantity, type: BigDecimal, default: 0

    belongs_to :uom, class_name: 'Common::UnitOfMeasure', optional: true
    belongs_to :strain, class_name: 'Common::Strain', optional: true
    belongs_to :facility

    has_many :articles, class_name: 'Inventory::ItemArticle'
    has_many :item_transactions, class_name: 'Inventory::ItemTransaction'
  end
end
