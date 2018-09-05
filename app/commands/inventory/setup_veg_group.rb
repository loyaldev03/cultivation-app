########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupVegGroup
    prepend SimpleCommand

    # TODO: 
    # 1. validation on mother plant id
    # 2. mother location not needed
    # 3. validate is bought
    # 4. validate trays are not veg only

    attr_reader :user,
      :args,
      :strain_name,
      :strain_type,
      :plant_ids,
      :veg_ids,  # veg_ids is raw plant ID and location ID pairing
      :planted_on,
      :expected_harvested_on,
      :mother_id,
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
      Rails.logger.debug '>>>> SetupVeg'
      Rails.logger.debug @args

      @strain_name = args[:strain]
      @strain_type = args[:strain_type]
      @veg_ids = args[:veg_ids]
      @planted_on = args[:planted_on]
      @expected_harvested_on = args[:expected_harvested_on]
      @mother_id = args[:mother_id]
      
      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name] && args[:vendor_name].strip
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
    end

    def call
      split_veg_ids

      if valid_permission? && valid_data?
        create_strain
        vendor = create_vendor
        @mother_id = nil if is_purchased?
        vegs = create_vegs(veg_ids, @mother_id)
        create_invoice(vegs, vendor, invoice_no) if is_purchased?
        vegs
      end
    end

    private

    def split_veg_ids
      @veg_ids = @veg_ids.split(/[\n\r]/).reject { |x| x.empty? }.map(&:strip)
      @plant_ids = @veg_ids.map { |x| x.split(',')[0].strip }
    end

    def valid_permission?
      true  # TODO: Check user role
    end

    def valid_data?
      # All serial number should be new
      existing_records = Inventory::ItemArticle.in(serial_no: @plant_ids).pluck(:serial_no)

      if existing_records.count > 0
        errors.add(:clone_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.")
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

    def create_vegs(veg_ids, mother_id)
      trays = QueryAllValidFacilityLocations.call.result.reject { |x| x[:t_id].blank? }
      result = Hash.new { |hash, key| hash[key] = { plant_ids: [], plant_status: nil } }

      veg_ids.each do |line|
        plant_id, location = line.split(',')
        tray = trays.find { |x| x[:value] == location.strip }
        Rails.logger.debug("tray: #{tray}")
        tray_id = tray[:t_id]
        plant_status = tray[:rm_purpose]

        result[tray_id][:plant_ids] << plant_id.strip
        result[tray_id][:plant_status] = plant_status
      end

      vegs = []
      result.each do |_tray_id, plant_ids_and_status|
        _plant_ids     = plant_ids_and_status[:plant_ids]
        _plant_status  = plant_ids_and_status[:plant_status]
        Rails.logger.debug("_plant_status: #{_plant_status}")

        new_vegs       = create_veg(_plant_ids,
                                    _plant_status,
                                    strain_name,
                                    _tray_id,
                                    planted_on,
                                    expected_harvested_on,
                                    mother_id)
        vegs.concat(new_vegs)
      end

      vegs
    end

    def create_veg(_plant_ids, _plant_status, _strain_name, _tray_id, _planted_on, _expected_harvested_on, _mother_plant_id)
      command = Inventory::CreatePlants.call(
        status: 'available',
        plant_ids: _plant_ids,
        strain_name: _strain_name,
        location_id: _tray_id,
        location_type: 'tray',
        planted_on: _planted_on,
        expected_harvested_on: _expected_harvested_on,
        plant_status: _plant_status,
        mother_plant_id: _mother_plant_id,
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :plant_ids, :clone_ids)
        combine_errors(command.errors, :strain_name, :strain_name)
        combine_errors(command.errors, :location_id, :clone_ids)  # there is no field to host tray id errors, i just park all under clone_ids
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
