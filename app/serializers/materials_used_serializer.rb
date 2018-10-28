class MaterialsUsedSerializer
  include FastJsonapi::ObjectSerializer

  attributes :item_id, :quantity, :uom

  attributes :name do |object|
    object.raw_material.name
  end

  attributes :raw_material_id do |object|
    object.raw_material_id.to_s
  end

  attributes :qty do |object|
    object.quantity
  end
end
