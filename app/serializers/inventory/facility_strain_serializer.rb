module Inventory
  class FacilityStrainSerializer
    include FastJsonapi::ObjectSerializer

    attributes :thc,
      :cbd,
      :strain_name,
      :strain_type,
      :indica_makeup,
      :sativa_makeup,
      :testing_status

    attribute :id do |object|
      object.id.to_s
    end

    attribute :facility_name do |object|
      object.facility.name
    end

    attribute :facility_id do |object|
      object.facility_id.to_s
    end

    attribute :label do |object|
      "#{object.strain_name} (#{object.facility.name})"
    end
  end
end
