module Inventory
  class VendorSerializer
    include FastJsonapi::ObjectSerializer
    # belongs_to :vendor

    attributes :name,
      :vendor_no,
      :address,
      :state_license_num,
      :location_license_num

    attribute :state_license_expiration_date do |object|
      object.state_license_expiration_date.blank? ? '' : object.state_license_expiration_date.iso8601
    end

    attribute :location_license_expiration_date do |object|
      object.location_license_expiration_date.blank? ? '' : object.location_license_expiration_date.iso8601
    end
  end
end
