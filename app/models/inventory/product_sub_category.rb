module Inventory
  class ProductSubCategory
    include Mongoid::Document

    field :name, type: String

    validates :name, presence: true
    validates_uniqueness_of :name

    embeds_many :package_units, class_name: 'Inventory::PackageUnit'
    embedded_in :product_category, class_name: 'Inventory::ProductCategory'
  end
end
