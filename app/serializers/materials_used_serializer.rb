class MaterialsUsedSerializer
  include FastJsonapi::ObjectSerializer

  attributes :task_item_id, :quantity, :uom

  attributes :name do |object|
    object.catalogue&.label
  end

  attributes :catalogue_id do |object|
    object.catalogue_id.to_s
  end

  attributes :qty do |object|
    object.quantity
  end

  attributes :uoms do |object|
    object.catalogue_id.present? ? object.catalogue.uoms.pluck(:unit) : nil
  end
end
