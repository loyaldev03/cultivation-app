########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupClones
    prepend SimpleCommand

    # cultivation_batch_id:"5bb3a28eedfdb20fc99678ea"
    # isBought:false
    # location_id:"5b907c97edfdb2685648870b"
    # mother_id:"5badf53eedfdb2b21c2cd67f"
    # plant_ids:"p1"
    # planting_date:"2018-08-31T16:00:00.000Z"

    attr_reader :user,
      :args,
      :is_draft,
      :cultivation_batch_id,
      :location_id,
      :mother_id,
      :plant_ids,
      :planting_date,
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
      Rails.logger.debug '>>>> SetupClones'
      Rails.logger.debug @args

      @is_draft = false
      @cultivation_batch_id = args[:cultivation_batch_id]
      @location_id = args[:location_id]
      @mother_id = args[:mother_id]
      @plant_ids = split(args[:plant_ids])
      @planting_date = args[:planting_date]

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
      if valid_permission? && valid_data?
        plants = create_clones

        if is_purchased?
          vendor = create_vendor
          create_invoice(plants, vendor, invoice_no)
        end

        plants
      end
    end

    private

    def split(ids)
      ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end

    def valid_permission?
      true  # TODO: Check user role
    end

    def valid_data?
      return true if is_draft

      # All serial number should be new
      existing_records = Inventory::Plant.in(plant_id: plant_ids).pluck(:plant_id)

      if existing_records.count > 0
        errors.add(:plant_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.")
      end

      tray = Tray.find(location_id)
      if tray.nil?
        errors.add(:location_id, 'Tray not found.')
      end

      batch = Cultivation::Batch.find(cultivation_batch_id)
      if batch.nil?
        errors.add(:cultivation_batch_id, 'Batch is required.')
      end

      errors.empty?
    end

    def is_purchased?
      vendor_name.present?
    end

    def create_clones
      facility_strain_id = Cultivation::Batch.find(cultivation_batch_id).facility_strain_id
      plants = []

      plant_ids.each do |plant_id|
        plant = Inventory::Plant.find_or_initialize_by(
          plant_id: plant_id,
          facility_strain_id: facility_strain_id,
        ) do |t|
          t.cultivation_batch_id = cultivation_batch_id
          t.current_growth_stage = 'clone'
          t.created_by = user
          t.location_id = location_id
          t.location_type = 'tray'
          t.status = is_draft ? 'draft' : 'available'
          t.planting_date = planting_date
        end
        plant.save!
        plants << plant
      end

      plants
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
