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
      result = nil
      if object.location_type == 'room'
        result = Facility.find_by(:'rooms._id' => BSON::ObjectId(object.location_id))
      elsif object.location_type == 'tray'
        result = Tray.find_by(object.location_id)
      end

      result ? result.name : ''
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
