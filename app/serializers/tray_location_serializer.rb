class TrayLocationSerializer
  include FastJsonapi::ObjectSerializer

  attribute :batch_id do |object|
    object.batch_id.to_s
  end
  attribute :facility_id do |object|
    object.facility_id.to_s
  end

  attribute :room_id do |object|
    object.room_id.to_s
  end

  attribute :row_id do |object|
    object.row_id.to_s
  end

  attribute :shelf_id do |object|
    object.shelf_id.to_s
  end
  
  attributes :is_active, :phase, :capacity, :start_date, :end_date

end
