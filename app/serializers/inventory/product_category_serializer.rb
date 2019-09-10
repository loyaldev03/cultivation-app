module Inventory
  class ProductCategorySerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :is_used, :is_active, :metrc_item_category, :deleted

    attribute :id do |object|
      object.id.to_s
    end

    attribute :sub_categories do |object|
      {
        id: object.id.to_s,
        name: object.name,
      }
    end
  end
end
