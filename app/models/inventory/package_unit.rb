module Inventory
  class PackageUnit
    include Mongoid::Document

    field :value, type: String
    field :label, type: String
    field :uom, type: String
    field :quantity_in_uom, type: Float, default: -> { 0 } # can be +/-

    validates :value, presence: true

    embedded_in :product_sub_category, class_name: 'Inventory::ProductSubCategory'
  end
end
