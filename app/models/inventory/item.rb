module Inventory
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # This is exact copy of data from metrc

    field :metrc_id, type: Integer # Item Id used by Metrc when updating
    field :name, type: String
    field :product_category_name, type: String # => item_category.name
    field :product_category_type, type: String # => item_cateogry.product_category_type
    field :quantity_type, type: String
    field :default_lab_testing_state, type: String
    field :uom_name, type: String
    field :approval_status, type: String
    field :metrc_strain_id, type: Integer # Strain Id used by Metrc
    field :strain_name, type: String
    field :administration_method, type: String
    field :unit_cbd_percent, type: Float
    field :unit_cbd_content, type: String
    field :unit_cbd_content_uom_name, type: String
    field :unit_thc_percent, type: Float
    field :unit_thc_content, type: String
    field :unit_thc_content_uom_name, type: String
    field :unit_volume, type: String
    field :unit_volume_uom_name, type: String
    field :unit_weight, type: Float
    field :unit_weight_uom_name, type: String
    field :serving_size, type: String
    field :supply_duration_days, type: String
    field :unit_quantity, type: String
    field :unit_quantity_uom_name, type: String
    field :ingredients, type: String
    field :deleted, type: Boolean, default: -> { false }
    field :is_used, type: Boolean, default: -> { false }

    belongs_to :batch, class_name: 'Cultivation::Batch'
    belongs_to :facility, class_name: 'Facility'
  end
end
