module Inventory
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :code, type: String # part no
    field :desc, type: String
    field :uom, type: String # unit of measure
    field :storage_type, type: String  # plant (seed, mother, clone), harvest, sale item, consumable, others, waste }
    field :strain, type: String
  end
end
