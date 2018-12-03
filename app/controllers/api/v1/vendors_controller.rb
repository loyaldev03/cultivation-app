class Api::V1::VendorsController < Api::V1::BaseApiController
  def index
    @vendors = Inventory::Vendor.where(:name => /^#{params[:filter]}/i).limit(7).map do |x|
      {
        value: x.id.to_s,
        label: x.name,
        vendor_no: x.vendor_no,
        address: x.address,
        state_license_num: x.state_license_num,
        state_license_expiration_date: x.state_license_expiration_date&.iso8601,
        location_license_num: x.location_license_num,
        location_license_expiration_date: x.location_license_expiration_date&.iso8601,
        vendor_type: x.vendor_type,
      }
    end

    render json: @vendors
  end
end
