########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupPlantsV2
    prepend SimpleCommand

    attr_reader :user,
      :id,
      :args,
      :is_draft,
      :cultivation_batch_id,
      :batch,
      :catalogue,
      :location_id,
      :mother_id,
      :plant_id,
      :planting_date,
      :wet_weight,
      :wet_waste_weight,
      :weight_uom,
      :facility,
      :facility_strain,

      # For purchase info
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :address,
      :purchase_order_no,
      :purchase_date,
      :purchase_order_id,
      :purchase_order_item_id,
      :invoice_no,
      :invoice_id,
      :invoice_item_id,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num

    def initialize(user, args)
      @is_draft = false
      @user = user
      @args = HashWithIndifferentAccess.new(args)

      @id = args[:id]
      @plant_id = args[:plant_id]
      @cultivation_batch_id = args[:cultivation_batch_id]
      @location_id = args[:location_id]
      @mother_id = args[:mother_id]
      @wet_weight = args[:wet_weight]
      @weight_uom = args[:weight_uom]
      @wet_waste_weight = args[:wet_waste_weight]
      @catalogue = Inventory::Catalogue.plant
      @batch = Cultivation::Batch.find(args[:cultivation_batch_id])
      @facility = Facility.find(@batch.facility_id) if @batch.present?
      @facility_strain = @batch.facility_strain if @batch.present?

      if args[:planting_date].present?
        @planting_date = args[:planting_date]
      else
        @planting_date = @batch&.start_date
      end

      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @purchase_order_no = args[:purchase_order_no]
      @purchase_date = args[:purchase_date]
      @purchase_order_id = args[:purchase_order_id]
      @purchase_order_item_id = nil
      @invoice_no = args[:invoice_no]
      @invoice_id = args[:invoice_id]
      @invoice_item_id = nil
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
    end

    # Exposed this so that compound command can use this to validate
    # before calling methods that can change data.
    def prevalidate
      valid_permission? && valid_data?
      errors
    end

    def call
      if valid_permission? && valid_data?
        invoice_item = save_purchase_info

        plant = if id.blank?
                  create_plant(invoice_item)
                else
                  update_plant(invoice_item)
                end
        plant
      end
    end

    private

    def valid_permission?
      true  # TODO: Check user role
    end

    def valid_data?
      return true if is_draft
      existing_records = Inventory::Plant.where(plant_id: plant_id)

      if plant_id.blank?
        errors.add(:plant_id, 'Plant ID is required.')
      elsif id.blank? && existing_records.count > 0
        errors.add(:plant_id, "These plant ID: #{plant_id} already exists in the system.")
      end

      if location_id.blank?
        errors.add(:location_id, 'Tray is required.')
      else
        tray = Tray.find(location_id)
        errors.add(:location_id, 'Tray not found.') if tray.nil?
      end
      errors.add(:cultivation_batch_id, 'Batch is required.') if batch.nil?

      if purchase_order_no.present?
        duplicate_po = Inventory::PurchaseOrder.where(purchase_order_no: purchase_order_no, id: {:$ne => purchase_order_id}).present?
        errors.add(:purchase_order_no, 'Puchase Order no already used.') if duplicate_po
      end
      errors.empty?
    end

    def is_purchased?
      batch.batch_source == 'clones_purchased'
    end

    def save_purchase_info
      if is_purchased?
        handle_po_invoice_switching
        vendor = save_vendor
        po_item = save_purchase_order(vendor)
        invoice_item = save_invoice(po_item)
        invoice_item
      else
        nil
      end
    end

    def handle_po_invoice_switching
      # If this is update.
      return if id.blank?

      transaction = Inventory::Plant.find(id)
      raise "Editing this record type: #{transaction.ref_type} is not supported" if transaction.ref_type != 'Inventory::VendorInvoiceItem'

      vi_item = Inventory::VendorInvoiceItem.find(transaction.ref_id)
      po = vi_item.invoice.purchase_order

      if po.id.to_s != purchase_order_id
        vi_item.purchase_order_item.destroy!
      else
        # If user has not change to another PO then keep the PO details so it can perform
        # necessary update.
        @purchase_order_item_id = vi_item.purchase_order_item.id
      end

      if vi_item.invoice_id.to_s != invoice_id
        vi_item.destroy!
      else
        # If user has not change to another invoice then keep the invoice details so it can perform
        # necessary update.
        @invoice_item_id = vi_item.id
      end
    end

    def update_plant(invoice_item)
      plant = Inventory::Plant.find(id)
      plant.plant_id = plant_id
      plant.facility_strain = facility_strain
      plant.cultivation_batch_id = cultivation_batch_id
      plant.current_growth_stage = batch.current_growth_stage
      plant.location_id = location_id
      plant.status = is_draft ? 'draft' : 'available'
      plant.planting_date = planting_date
      plant.mother_id = mother_id
      plant.wet_weight = wet_weight
      plant.wet_waste_weight = wet_waste_weight
      plant.wet_weight_uom = weight_uom if weight_uom.present?
      plant.ref_id = invoice_item.id if invoice_item.present?
      plant.ref_type = invoice_item.class.name if invoice_item.present?
      plant.save!
      plant
    end

    def create_plant(invoice_item)
      growth_stage = batch.current_growth_stage
      plant = Inventory::Plant.create!(
        plant_id: plant_id,
        facility_strain_id: facility_strain.id,
        cultivation_batch_id: cultivation_batch_id,
        current_growth_stage: growth_stage,
        created_by: user,
        location_id: location_id,
        location_type: 'tray',
        status: is_draft ? 'draft' : 'available',
        planting_date: planting_date,
        mother_id: mother_id,
        wet_weight: wet_weight,
        wet_waste_weight: wet_waste_weight,
        wet_weight_uom: weight_uom.present? ? weight_uom : nil,
        ref_id: invoice_item ? invoice_item.id : nil,
        ref_type: invoice_item ? invoice_item.class.name : nil,
      )
      plant
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
      po = nil

      if purchase_order_id.blank?
        po = Inventory::PurchaseOrder.new
      else
        po = Inventory::PurchaseOrder.find(purchase_order_id)
        raise 'PO id does not exists' if po.nil?
      end

      po.vendor = vendor
      po.purchase_order_no = purchase_order_no
      po.purchase_order_date = purchase_date
      po.facility = facility
      po.status = Inventory::PurchaseOrder::INVENTORY_SETUP

      po_item = nil
      if purchase_order_item_id.blank?
        po_item = po.items.build
      else
        po_item = po.items.find(purchase_order_item_id)
        raise 'PO id does not exists' if po_item.nil?
      end

      po_item.catalogue = catalogue
      po_item.quantity = 1
      po_item.uom = 'pc'
      po_item.price = 0
      po_item.currency = 'USD'
      po_item.tax = 0
      po_item.description = "PO created from plant setup - #{plant_id}",
      po_item.product_name = facility_strain.strain_name
      po_item.facility_strain = facility_strain

      po.save!
      po_item.save!
      po_item
    end

    def save_invoice(po_item)
      return nil if po_item.nil?

      invoice = if invoice_id.blank?
                  Inventory::VendorInvoice.new
                else
                  Inventory::VendorInvoice.find(invoice_id)
                end

      invoice.invoice_no = invoice_no
      invoice.vendor = po_item.purchase_order.vendor
      invoice.invoice_date = purchase_date
      invoice.facility = facility
      invoice.purchase_order = po_item.purchase_order
      invoice.status = Inventory::VendorInvoice::INVENTORY_SETUP

      invoice_item = if invoice_item_id.blank?
                       invoice.items.new
                     else
                       invoice.items.find(invoice_item_id)
                     end

      invoice_item.catalogue = catalogue
      invoice_item.uom = po_item.uom
      invoice_item.quantity = po_item.quantity
      invoice_item.price = po_item.price
      invoice_item.tax = po_item.tax
      invoice_item.currency = po_item.currency
      invoice_item.description = po_item.description
      invoice_item.product_name = po_item.product_name
      invoice_item.purchase_order_item = po_item
      invoice_item.facility_strain = facility_strain

      invoice.save!
      invoice_item.save!
      invoice_item
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end

    def split(ids)
      ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end
  end
end
