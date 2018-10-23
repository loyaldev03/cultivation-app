########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupPlants
    prepend SimpleCommand

    attr_reader :user,
      :id,
      :growth_stage,
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
      :purchase_order_no,
      :address,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num,
      :purchase_date,
      :batch

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      @id = args[:id]
      @is_draft = false
      @cultivation_batch_id = args[:cultivation_batch_id]
      @location_id = args[:location_id]
      @mother_id = args[:mother_id]
      @plant_ids = split(args[:plant_ids])
      @planting_date = args[:planting_date]
      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
      @purchase_date = args[:purchase_date]
      @invoice_no = args[:invoice_no]
      @purchase_order_no = args[:purchase_order_no]
      @batch = Cultivation::Batch.find(args[:cultivation_batch_id])
    end

    def call
      if valid_permission? && valid_data?
        plants = []
        if id.blank?
          plants = create_plants
        else
          plants = update_plant
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

      if id.blank? && existing_records.count > 0
        errors.add(:plant_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.")
      end

      tray = Tray.find(location_id)
      if tray.nil?
        errors.add(:location_id, 'Tray not found.')
      end

      if batch.nil?
        errors.add(:cultivation_batch_id, 'Batch is required.')
      end

      errors.empty?
    end

    def is_purchased?
      batch.batch_source == 'clones_purchased'
    end

    def update_plant
      facility_strain_id = batch.facility_strain_id
      growth_stage = batch.current_growth_stage
      plant = Inventory::Plant.find(id)

      result = plant.update!(
        plant_id: plant_ids[0],
        facility_strain_id: facility_strain_id,
        cultivation_batch_id: cultivation_batch_id,
        current_growth_stage: growth_stage,
        location_id: location_id,
        status: is_draft ? 'draft' : 'available',
        planting_date: planting_date,
        mother_id: mother_id,
      )

      # TODO: Section below to be replaced by invoice_id when user select existing invoice
      # If new invoice, it may have vendor id
      # if no vendor id, then take all fields to create vendor & invoice.

      # Rails.logger.debug "\t\t\t\t>> Updating plant result: location_id: #{location_id}"
      # Rails.logger.debug "\t\t\t\t>> Updating plant result: #{result}"

      if is_purchased?
        if plant.vendor_invoice_id.blank?
          # Rails.logger.debug "\t\t\t\t>> Creating new invoice: #{vendor_name}, invoice_no: #{invoice_no}"
          vendor = Inventory::Vendor.find_by(name: vendor_name)
          vendor_id = vendor ? vendor.id : nil
          vendor = save_vendor(vendor_id)

          # Rails.logger.debug "\t\t\t\t>> Creating new invoice, vendor_id: #{vendor_id}"
          create_invoice([plant], vendor, invoice_no, purchase_date, purchase_order_no)
        else
          invoice = Inventory::VendorInvoice.find(plant.vendor_invoice_id)
          # Rails.logger.debug "\t\t\t\t>> Updating existing invoice?: #{invoice.id.to_s}"
          save_vendor(invoice.vendor_id)
          update_invoice(invoice)
        end
      end

      plant
    end

    def update_invoice(invoice)
      command = Inventory::SavePlantInvoice.call(user, [], invoice.vendor, invoice.invoice_no, purchase_date, purchase_order_no)
      unless command.success?
        combine_errors(command.errors, :errors, :plant_ids)
      end
    end

    def create_plants
      facility_strain_id = batch.facility_strain_id
      growth_stage = batch.current_growth_stage

      plants = plant_ids.map do |plant_id|
        Inventory::Plant.create!(
          plant_id: plant_id,
          facility_strain_id: facility_strain_id,
          cultivation_batch_id: cultivation_batch_id,
          current_growth_stage: growth_stage,
          created_by: user,
          location_id: location_id,
          location_type: 'tray',
          status: is_draft ? 'draft' : 'available',
          planting_date: planting_date,
          mother_id: mother_id,
        )
      end

      if is_purchased?
        vendor = Inventory::Vendor.find_by(name: vendor_name)
        vendor_id = vendor ? vendor.id : nil

        vendor = save_vendor(vendor_id)
        create_invoice(plants, vendor, invoice_no, purchase_date, purchase_order_no)
      end

      plants
    end

    def save_vendor(vendor_id)
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

    def create_invoice(plants, vendor, invoice_no, purchase_date, purchase_order_no)
      command = Inventory::SavePlantInvoice.call(user, plants, vendor, invoice_no, purchase_date, purchase_order_no)
      unless command.success?
        combine_errors(command.errors, :errors, :plant_ids)
      end
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
