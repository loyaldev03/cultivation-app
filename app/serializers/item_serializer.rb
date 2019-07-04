class ItemSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
             :product_category_name,
             :product_category_type,
             :quantity_type,
             :uom_name,
             :strain_name,
             :unit_quantity,
             :unit_quantity_uom_name,
             :is_used

  attribute :id do |object|
    object.id.to_s
  end
end
