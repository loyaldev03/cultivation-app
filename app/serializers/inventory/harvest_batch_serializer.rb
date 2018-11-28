module Inventory
  class HarvestBatchSerializer
    include FastJsonapi::ObjectSerializer

    attributes :harvest_name,
      :harvest_name,
      :total_wet_weight,
      :total_wet_waste_weight,
      :uom,
      :status

    attribute :harvest_date do |object|
      object.harvest_date.iso8601
    end

    attribute :strain_name do |object|
      object.facility_strain.strain_name
    end

    attribute :location do |object|
      Tray.in(id: object.plants.pluck(:location_id)).pluck(:code).uniq.join(', ')
    end

    attribute :plant_count do |object|
      object.plants.count
    end
  end
end
