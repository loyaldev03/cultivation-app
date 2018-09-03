module Inventory
  class ItemArticleSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id,
      :serial_no,
      :location_id,
      :location_type,
      :facility_id,
      :cultivation_batch_id,
      :status,
      :plant_status

    attribute :item_name do |object|
      object.item.name
    end

    attribute :created_at do |object|
      object.c_at.iso8601
    end

    attribute :location_name do |object|
      if object.location_type == 'room'
        facility = Facility.find_by(:'rooms._id' => BSON::ObjectId(object.location_id))
        room = facility.rooms.find(object.location_id)
        room ? "#{facility.code}.#{room.code} - #{room.name} " : ''
      elsif object.location_type == 'tray'
        tray = Tray.find_by(object.location_id)
        facility = Facility.find_by(:'rooms.rows.shelves._id' => tray.shelf_id)
        tray ? "#{facility.code}...#{tray.code} - #{tray.name} " : ''
      else
        ''
      end
    end

    attribute :facility_name do |object|
      "#{object.facility.name} (#{object.facility.code})"
    end

    attribute :planted_on do |object|
      if object.planted_on
        object.planted_on.iso8601
      else
        ''
      end
    end

    attribute :cultivation_batch_name do |object|
      if object.cultivation_batch
        object.cultivation_batch.batch_no
      else
        ''
      end
    end
  end
end
