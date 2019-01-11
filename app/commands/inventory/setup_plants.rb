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
      :batch,
      :catalogue

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
      # @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_id = Vendor.find_by(name: args[:vendor_name])&.id

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
      @catalogue = Inventory::Catalogue.plant
    end

    def call
      if valid_permission? && valid_data?
        invoice_item = save_purchase_info

        if id.blank?
          create_plants(invoice_item)
        else
          update_plant(invoice_item)
        end
      end
    end

    private

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

    def save_purchase_info
      if is_purchased?
        vendor = save_vendor
        po_item = save_purchase_order(vendor)
        invoice_item = save_invoice(po_item)
        invoice_item
      else
        nil
      end
    end

    def update_plant(invoice_item)
      facility_strain_id = batch.facility_strain_id
      growth_stage = batch.current_growth_stage

      plant = Inventory::Plant.find(id)
      old_invoice_item_id = plant.ref_id

      plant.update!(
        plant_id: plant_ids[0],
        facility_strain_id: facility_strain_id,
        cultivation_batch_id: cultivation_batch_id,
        current_growth_stage: growth_stage,
        location_id: location_id,
        status: is_draft ? 'draft' : 'available',
        planting_date: planting_date,
        mother_id: mother_id,
        ref_id: invoice_item ? invoice_item.id : nil,
        ref_type: invoice_item ? invoice_item.class.name : nil,
      )

      # Update tray bookings
      UpdateActiveTrayPlansJob.perform_later(cultivation_batch_id)

      # if old_invoice_item_id != plant.ref_id
      update_po_invoice_count(old_invoice_item_id)
      update_po_invoice_count(invoice_item&.id)
      # end
      plant
    end

    def create_plants(invoice_item)
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
          ref_id: invoice_item ? invoice_item.id : nil,
          ref_type: invoice_item ? invoice_item.class.name : nil,
        )
      end

      # Update tray bookings
      UpdateActiveTrayPlansJob.perform_later(cultivation_batch_id)

      update_po_invoice_count(invoice_item&.id)
      plants
    end

    def save_vendor
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

    def save_purchase_order(vendor)
      return nil if vendor.nil?

      facility_strain = batch.facility_strain
      purchase_order = Inventory::PurchaseOrder.find_or_create_by!(purchase_order_no: purchase_order_no, vendor: vendor) do |po|
        po.purchase_order_date = purchase_date
        po.facility = facility_strain.facility
        po.status = Inventory::PurchaseOrder::INVENTORY_SETUP
      end

      if id.blank?
        po_item = purchase_order.items.create!(
          facility_strain_id: facility_strain.id,
          catalogue: catalogue,
          quantity: plant_ids.count,
          uom: 'pc',
          price: 0,
          currency: 'USD',
          tax: 0,
          description: "PO created from plant setup - #{plant_ids.join(', ')}",
          product_name: facility_strain.strain_name,
        )
        po_item
      else
        purchase_order.items.find_by(facility_strain_id: facility_strain.id)
      end
    end

    def save_invoice(po_item)
      return nil if po_item.nil?

      invoice = Inventory::VendorInvoice.find_or_create_by!(
        invoice_no: invoice_no,
        vendor: po_item.purchase_order.vendor,
      ) do |inv|
        inv.invoice_date = purchase_date
        inv.facility = po_item.purchase_order.facility
        inv.purchase_order = po_item.purchase_order
        inv.status = Inventory::VendorInvoice::INVENTORY_SETUP
      end

      invoice_item = invoice.items.find_or_create_by!(facility_strain_id: po_item.facility_strain_id,
                                                      catalogue: po_item.catalogue) do |inv_item|
        inv_item.uom = po_item.uom
        inv_item.price = 0
        inv_item.tax = 0
        inv_item.description = po_item.description
        inv_item.product_name = po_item.product_name
      end
      invoice_item
    end

    def update_po_invoice_count(invoice_item_id)
      return if invoice_item_id.nil?

      invoice_item = Inventory::VendorInvoiceItem.find(invoice_item_id)
      new_quantity = Inventory::Plant.where(ref_id: invoice_item_id, ref_type: 'Inventory::VendorInvoiceItem').count
      invoice_item.update!(quantity: new_quantity)

      po_item = invoice_item.invoice.purchase_order.items.find_by(facility_strain_id: invoice_item.facility_strain_id)
      invoice_item.update!(quantity: new_quantity)
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end

    def split(ids)
      ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end
  end
end
