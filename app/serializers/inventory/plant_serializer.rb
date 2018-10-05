module Inventory
  class PlantSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id,
      :plant_id,
      :plant_tag,
      :location_type,
      :status,
      :current_growth_stage,
      :origin_type,
      :wet_weight,
      :wet_weight_unit

    attribute :strain_name do |object|
      object.facility_strain.strain_name
    end

    attribute :created_by_id do |object|
      object.created_by_id.to_s
    end

    attribute :cultivation_batch_id do |object|
      object.cultivation_batch_id.to_s
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :mother_date do |object|
      object.mother_date.iso8601 if object.mother_date
    end

    attribute :planting_date do |object|
      object.planting_date.iso8601 if object.planting_date
    end

    attribute :veg_date do |object|
      object.veg_date.iso8601 if object.veg_date
    end

    attribute :veg1_date do |object|
      object.veg1_date.iso8601 if object.veg1_date
    end

    attribute :veg2_date do |object|
      object.veg2_date.iso8601 if object.veg2_date
    end

    attribute :flower_date do |object|
      object.flower_date.iso8601 if object.flower_date
    end

    attribute :harvest_date do |object|
      object.harvest_date.iso8601 if object.harvest_date
    end

    attribute :expected_harvest_date do |object|
      object.expected_harvest_date.iso8601 if object.expected_harvest_date
    end

    attribute :origin_id do |object|
      object.origin_id.to_s
    end

    attribute :created_at do |object|
      object.c_at.iso8601
    end

    attribute :location_name do |object, params|
      if params && params[:exclude_location] == true
        ''
      elsif !object.location_id
        ''
      elsif object.location_type == 'room'
        facility = Facility.find_by(:'rooms._id' => BSON::ObjectId(object.location_id))
        room = facility.rooms.find(object.location_id)
        room ? "#{facility.code}.#{room.code} - #{room.name}" : ''
      elsif object.location_type == 'tray'
        tray = Tray.find_by(id: object.location_id)
        facility = Facility.find_by(:'rooms.rows.shelves._id' => tray.shelf_id)
        tray ? "#{facility.code}...#{tray.code}" : ''
      else
        ''
      end
    end
  end
end
