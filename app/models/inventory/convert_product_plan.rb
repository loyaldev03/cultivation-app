module Inventory
  class ConvertProductPlan
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :product_type, type: String
    field :package_plan, type: String
    field :quantity, type: Float, default: -> { 0 }
    field :uom, type: String
    field :conversion, type: Float, default: -> { 0 }
    field :total_weight, type: Float, default: -> { 0 }

    belongs_to :package, class_name: 'Inventory::ItemTransaction'
  end
end
