class TaskDetailsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :phase,
    :name,
    :duration,
    :work_status,
    :wbs

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
      }
    end
  end

  attributes :location_name do |object|
    if !object.location_id
      ''
    elsif object.location_type == 'Room'
      facility = Facility.find_by(:'rooms._id' => BSON::ObjectId(object.location_id))
      room = facility.rooms.find(object.location_id)
      room ? "#{facility.code}.#{room.code} - #{room.name}" : ''
    elsif object.location_type == 'Tray'
      tray = Tray.find_by(id: object.location_id)
      facility = Facility.find_by(:'rooms.rows.shelves._id' => tray.shelf_id)
      tray ? "#{facility.code}...#{tray.code}" : ''
    elsif object.location_type == 'Facility'
      facility = Facility.find(object.location_id)
      facility.name
    else
      ''
    end
  end

  attribute :issues do |object|
    object.issues.map { |a| {id: a.id.to_s, title: a.title} }
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

  attribute :deletable do |object|
    if object.issues.count > 0 || object.user_ids.count > 0 || object.material_use.count > 0
      false
    else
      true
    end
  end
end
