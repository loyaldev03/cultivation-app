class TaskSerializer
  include FastJsonapi::ObjectSerializer

  attributes :phase,
    :name,
    :duration,
    :start_date,
    :end_date,
    :position,
    :estimated_hours,
    :estimated_cost,
    :actual_hours,
    :actual_cost,
    :wbs,
    :is_parent,
    :indent,
    :indelible,
    :location_type,
    :work_status,
    :water_ph,
    :instruction

  attributes :id do |object|
    object.id.to_s
  end

  attributes :depend_on do |object|
    object.depend_on.to_s
  end

  attribute :items do |object|
    object.material_use.map do |item|
      {
        id: item.id.to_s,
        product_name: item.product.try(:name),
        product_id: item.product.try(:id).to_s,
        category: item.product.try(:catalogue).try(:category),
        quantity: item.quantity,
        uom: item.uom,
        catalogue_id: item&.product&.catalogue_id&.to_s,
        uoms: item&.product&.uoms&.pluck(:unit),
        ppm: item&.product&.ppm,
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
    []
  end

  attribute :deletable do |object|
    if object.is_parent || object.issues.present? || object.user_ids.present? || object.material_use.present?
      false
    else
      true
    end
  end
end
