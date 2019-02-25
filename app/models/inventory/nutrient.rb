module Inventory
  class Nutrient
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :element, type: String
    field :value, type: String

    embedded_in :product, class_name: 'Inventory:Product'
  end
end
