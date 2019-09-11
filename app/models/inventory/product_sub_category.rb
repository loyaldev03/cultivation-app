module Inventory
  class ProductSubCategory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String

    validates :name, presence: true
    validates_uniqueness_of :name

    embedded_in :product_category, class_name: 'Inventory::ProductCategory'
  end
end
