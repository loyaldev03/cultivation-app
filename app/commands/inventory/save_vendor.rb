module Inventory
  class SaveVendor
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = HashWithIndifferentAccess.new(args) # wrap with this so access by symbol and string works
    end

    def call
      if valid?
        save_record
      else
        nil
      end
    end

    private

    def save_record
      id = args[:id]
      params = args.except(:id)
      vendor = if id.present?
                 Inventory::Vendor.find_by(id: id)
               else
                 Inventory::Vendor.find_by(name: params[:name])
               end

      if vendor
        vendor.update!(params)
        vendor
      else
        # TODO: Temporary solution!
        Inventory::Vendor.create!(params)
      end
    end

    def valid?
      errors.add(:name, 'Vendor name cannot be empty') if args['name'].blank?
      if args['vendor_type'] == 'plant_supplier'
        errors.add(:state_license_num, 'State license is required') if args['state_license_num'].blank?
        errors.add(:state_license_expiration_date, 'State license is required') if args['state_license_expiration_date'].blank?
        errors.add(:location_license_num, 'Location license is required') if args['location_license_num'].blank?
        errors.add(:location_license_expiration_date, 'Location license is required') if args['location_license_expiration_date'].blank?
      end
      errors.empty?
    end
  end
end
