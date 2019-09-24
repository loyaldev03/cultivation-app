module Inventory
  class ProductSubCategorySerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :quantity_type, :is_used, :is_active, :metrc_item_category, :deleted

    attribute :id do |object|
      object.id.to_s
    end

    attribute :sub_categories do |object|
      object.package_units
    end
  end
end
