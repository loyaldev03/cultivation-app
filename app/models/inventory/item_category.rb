module Inventory
  class ItemCategory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # This is exact copy of data from metrc

    field :name, type: String
    field :product_category_type, type: String
    field :quantity_type, type: String
    field :requires_strain, type: Boolean, default: -> { false }
    field :requires_item_brand, type: Boolean, default: -> { false }
    field :requires_administration_method, type: Boolean, default: -> { false }
    field :requires_unit_cbd_percent, type: Boolean, default: -> { false }
    field :requires_unit_cbd_content, type: Boolean, default: -> { false }
    field :requires_unit_thc_percent, type: Boolean, default: -> { false }
    field :requires_unit_thc_content, type: Boolean, default: -> { false }
    field :requires_unit_volume, type: Boolean, default: -> { false }
    field :requires_unit_weight, type: Boolean, default: -> { false }
    field :requires_serving_size, type: Boolean, default: -> { false }
    field :requires_supply_duration_days, type: Boolean, default: -> { false }
    field :requires_ingredients, type: Boolean, default: -> { false }
    field :requires_product_photo, type: Boolean, default: -> { false }
    field :can_contain_seeds, type: Boolean, default: -> { false }
    field :can_be_remediated, type: Boolean, default: -> { false }
  end
end
