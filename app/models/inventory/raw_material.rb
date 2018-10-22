module Inventory
  class RawMaterial
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :is_active, type: Boolean
    field :category, type: String             # { nutrient, grow_light, others }
    field :sub_category, type: String
  end
end
