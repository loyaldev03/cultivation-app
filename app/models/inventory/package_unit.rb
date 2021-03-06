module Inventory
  class PackageUnit
    include Mongoid::Document

    field :value, type: String
    field :label, type: String
    field :uom, type: String
    field :quantity_in_uom, type: Float, default: -> { 0 } # can be +/-
    field :is_active, type: Boolean, default: false

    field :category_name, type: String #for sub_category to store package_unit_name like Blunt, Joint, Mini Pre-roll

    validates :value, presence: true

    embedded_in :product_sub_category, class_name: 'Inventory::ProductSubCategory'
  end
end
