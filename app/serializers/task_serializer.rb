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
    :wbs,
    :indent,
    :indelible,
    :task_type

  attributes :id do |object|
    object.id.to_s
  end

  attributes :parent_id do |object|
    object.parent_id.to_s
  end

  attributes :depend_on do |object|
    object.depend_on.to_s
  end

  attributes &:wbs

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

  attribute :user_ids do |object|
    object.user_ids.map(&:to_s)
  end

  attribute :actual_hours do |object, params|
    # TODO: TBD
    object.actual_hours
  end

  attribute :actual_cost do |object, params|
    # TODO: TBD
    object.actual_cost
  end
end
