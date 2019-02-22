class TaskDetailsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :phase,
    :name,
    :duration,
    :work_status,
    :wbs,
    :location_type

  attributes :id do |object|
    object.id.to_s
  end

  # TODO: Not sure what is this for...
  attribute :items do |object|
    object.material_use.map do |item|
      {
        id: item.id.to_s,
        product_name: item.product.try(:name),
        product_id: item.product.try(:id).to_s,
        category: item.product.try(:catalogue).try(:category),
        quantity: item.quantity,
        uom: item.uom,
        catalogue_id: item&.catalogue_id&.to_s,
        uoms: item&.product&.catalogue&.uoms&.pluck(:unit),
      }
    end
  end

  attributes :location_id do |object|
    object.location_id.to_s
  end

  attribute :user_ids do |object|
    object.user_ids.map(&:to_s)
  end

  attribute :issues do |object|
    object.issues.map { |a| {id: a.id.to_s, title: a.title} }
  end

  attribute :notes do |object|
    object.notes.map { |a| {id: a.id.to_s, body: a.body} }
  end

  attribute :deletable do |object|
    if object.issues.count > 0 || object.user_ids.count > 0 || object.material_use.count > 0
      false
    else
      true
    end
  end
end
