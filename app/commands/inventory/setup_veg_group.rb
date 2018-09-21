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
      :plant_qty,
      :planted_on,
      :expected_harvested_on,
      :mother_id,
      :tray_id,
      :cultivation_batch_id,
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
      @plant_qty = args[:plant_qty]
      @planted_on = args[:planted_on]
      @expected_harvested_on = args[:expected_harvested_on]
      @mother_id = args[:mother_id]
      @tray_id = args[:tray]
      @cultivation_batch_id = args[:cultivation_batch_id]

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
      @veg_ids = generate_or_extract_plant_ids

      if valid_permission? && valid_data?
        create_strain
        vendor = create_vendor
        @mother_id = nil if is_purchased?
        vegs = create_vegs
        create_invoice(vegs, vendor, invoice_no) if is_purchased?
        vegs
      end
    end

    private

    def generate_or_extract_plant_ids
      if veg_ids.strip.present?
        veg_ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
      else
        ids = Inventory::GeneratePlantSerialNo.call(plant_qty.to_i).result
        ids
      end
    end

    def split_veg_ids(input)
      input.split(/[\n\r]/).reject { |x| x.empty? }.map(&:strip)
    end

    def valid_permission?
      true  # TODO: Check user role
    end

    def valid_data?
      existing_records = Inventory::ItemArticle.in(serial_no: veg_ids).pluck(:serial_no)

      if existing_records.count > 0
        errors.add(:veg_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.")
      end

      valid_tray()
      errors.empty?
    end

    def valid_tray()
      locations = QueryAllValidFacilityLocations.call.result
      tray = locations.find { |x| x[:t_id] == tray_id }
      mother_room = locations.find { |x| x[:room_id] }

      if tray.nil?
        errors.add(:tray, 'Tray does not exists.')
      elsif !%w(veg veg1 veg2).include?(tray[:rm_purpose])
        errors.add(:tray, 'Tray does not belong to a veg room.')
      end
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

    def create_vegs
      vegs = _create_veg(veg_ids,
                         'veg',
                         strain_name,
                         tray_id,
                         planted_on,
                         expected_harvested_on,
                         mother_id,
                         cultivation_batch_id)
      vegs
    end

    def _create_veg(_plant_ids, _plant_status, _strain_name, _tray_id, _planted_on, _expected_harvested_on, _mother_plant_id, _cultivation_batch_id)
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
        cultivation_batch_id: _cultivation_batch_id,
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :plant_ids, :veg_ids)
        combine_errors(command.errors, :strain_name, :strain_name)
        combine_errors(command.errors, :location_id, :clone_ids)  # there is no field to host tray id errors, i just park all under clone_ids
        []
      end
    end

    def create_invoice(plants, vendor, invoice_no)
      command = Inventory::SaveBlankInvoice.call(nil, plants, vendor, invoice_no)
      unless command.success?
        combine_errors(command.errors, :errors, :veg_ids)
      end
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
