module Inventory
  class VendorSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name,
      :vendor_no,
      :address,
      :state_license_num,
      :location_license_num

    attribute :value do |object|
      object.id
    end

    attribute :label do |object|
      object.name
    end

    attribute :state_license_expiration_date do |object|
      object.state_license_expiration_date.blank? ? '' : object.state_license_expiration_date.iso8601
    end

    attribute :location_license_expiration_date do |object|
      object.location_license_expiration_date.blank? ? '' : object.location_license_expiration_date.iso8601
    end
  end
end
