class ItemCategorySerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
             :product_category_type,
             :quantity_type,
             :requires_strain,
             :is_active

  attribute :id do |object|
    object.id.to_s
  end

end
