class TaskDetailsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :phase,
    :name,
    :duration,
    :work_status,
    :wbs,
    :indelible,
    :estimated_hours

  attribute :id do |object|
    object.id.to_s
  end

  attribute :batch_id do |object|
    object.batch_id.to_s
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
        uoms: item&.product&.catalogue&.uoms&.pluck(:unit),
        ppm: item&.product&.ppm,
        checked: item&.checked,
      }
    end
  end

  attribute :nutrients do |object|
    object.material_use.nutrients.map do |item|
      {
        id: item.id.to_s,
        product_name: item.product.try(:name),
        product_id: item.product.try(:id).to_s,
        category: item.product.try(:catalogue).try(:category),
        quantity: item.quantity,
        uom: item.uom,
        catalogue_id: item&.product&.catalogue_id&.to_s,
        uoms: item&.product&.catalogue&.uoms&.pluck(:unit),
        ppm: item&.product&.ppm,
        checked: item&.checked,
      }
    end
  end

  attribute :location_name do |object, params|
    if params[:query] && object.location_id
      params[:query].get_location_code(object.location_id)
    else
      ''
    end
  end

  attribute :issues do |object|
    object.issues.not_archived.map { |a|
      {
        id: a.id.to_s,
        issue_no: a.issue_no,
        title: a.title,
        severity: a.severity,
        status: a.status,
        tags: a.tags,
        issue_no: a.issue_no,
        created_at: a.created_at,
      }
    }
  end

  attribute :notes do |object|
    object.notes.map do |a|
      {
        id: a.id.to_s,
        body: a.body,
        u_at: a.u_at,
        u_by: a[:u_by],
      }
    end
  end

  attribute :add_nutrients do |object|
    object.add_nutrients.map do |a|
      {
        id: a.id.to_s,
        element: a.element,
        value: a.value,
        checked: a.checked,
      }
    end
  end

  attribute :deletable do |object|
    if object.issues.present? || object.user_ids.present? || object.material_use.present?
      false
    else
      true
    end
  end
end
