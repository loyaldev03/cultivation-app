module Inventory
  class ProductCategorySerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :quantity_type, :is_used, :is_active, :metrc_item_category, :deleted

    attribute :id do |object|
      object.id.to_s
    end

    attribute :sub_categories do |object|
      object.sub_categories.map do |sub|
        {
          id: sub.id.to_s,
          name: sub.name,
          product_category_id: object.id.to_s,
          product_category_name: object.name,
        }
      end
    end
  end
end
