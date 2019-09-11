module Inventory
  class PackageUnit
    include Mongoid::Document

    field :value, type: String
    field :label, type: String

    validates :value, presence: true

    embedded_in :product_sub_category, class_name: 'Inventory::ProductSubCategory'
  end
end
