########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupMother
    prepend SimpleCommand
    attr_reader :user,
      :args,
      :strain_name,
      :strain_type,
      :plant_ids,
      :room_id,
      :planted_on,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :invoice_no,
      :address,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      Rails.logger.debug '>>>> SetupMother'
      Rails.logger.debug @args

      @strain_name = args[:strain]
      @strain_type = args[:strain_type]
      @plant_ids = args[:plant_ids]
      @room_id = args[:room_id]
      @planted_on = args[:planted_on]
      @vendor_name = args[:vendor_name] && args[:vendor_name].strip
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
    end

    def call
      @plant_ids = args[:plant_ids].gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)

      if valid_permission? && valid_data?
        create_strain
        vendor = create_vendor
        plants = create_mother_plants
        create_invoice(plants, vendor, invoice_no) if is_purchased?
        plants
      end
    end

    private

    def valid_permission?
      true  # TODO: Check user role
    end

    def valid_data?
      # All serial number should be new
      # Rails.logger.debug "args[:plant_ids].index('\\n') - #{i} " +  args[:plant_ids].gsub(/[\n\r]/, ",").split(",").to_s
      # Rails.logger.debug "args[:plant_ids].index('\\r') - #{f}"
      # Rails.logger.debug "args[:plant_ids].index('n') - #{g}"
      existing_records = Inventory::ItemArticle.in(serial_no: plant_ids).pluck(:serial_no)

      if existing_records.count > 0
        errors.add(:plant_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.")
      end
      errors.empty?
    end

    def is_purchased?
      vendor_name.present?
    end

    def create_strain
      command = Common::SaveStrain.call(name: strain_name, strain_type: strain_type)

      unless command.success?
        combine_errors(command.errors, :name, :strain)
        combine_errors(command.errors, :strain_type, :strain_type)
      end
    end

    def create_vendor
      vendor = Inventory::Vendor.find_by(name: vendor_name)
      vendor_id = vendor ? vendor.id : nil

      command = Inventory::SaveVendor.call(
        id: vendor_id,
        name: vendor_name,
        vendor_no: vendor_no,
        address: address,
        state_license_num: vendor_state_license_num,
        state_license_expiration_date: vendor_state_license_expiration_date,
        location_license_expiration_date: vendor_location_license_expiration_date,
        location_license_num: vendor_location_license_num,
        vendor_type: 'plant_supplier',
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :vendor_name, :name)
        combine_errors(command.errors, :vendor_no, :vendor_no)
        combine_errors(command.errors, :address, :address)
        combine_errors(command.errors, :vendor_state_license_num, :state_license_num)
        combine_errors(command.errors, :vendor_state_license_expiration_date, :state_license_expiration_date)
        combine_errors(command.errors, :vendor_location_license_expiration_date, :location_license_expiration_date)
        combine_errors(command.errors, :vendor_location_license_num, :location_license_num)
        nil
      end
    end

    def create_mother_plants
      command = Inventory::CreatePlants.call(
        plant_ids: plant_ids,
        strain_name: strain_name,
        location_id: room_id,
        location_type: 'room',
        planted_on: planted_on,
        plant_status: 'mother',
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :plant_ids, :plant_ids)
        combine_errors(command.errors, :strain_name, :strain_name)
        combine_errors(command.errors, :location_id, :room_id)
        combine_errors(command.errors, :planted_on, :planted_on)
        []
      end
    end

    def create_invoice(plants, vendor, invoice_no)
      command = Inventory::SaveBlankInvoice.call(nil, plants, vendor, invoice_no)
      unless command.success?
        combine_errors(command.errors, :errors, :plant_ids)
      end
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
