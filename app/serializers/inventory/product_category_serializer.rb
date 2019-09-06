module Inventory
  class ProductCategorySerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :is_used, :is_active, :metrc_item_category

    attribute :id do |object|
      object.id.to_s
    end
  end
end
