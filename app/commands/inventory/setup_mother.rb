########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupMother
    prepend SimpleCommand
    attr_reader :user,
      :args,
      :id,
      :is_draft,
      :user,
      :facility_strain_id,
      :plant_ids,
      :location_id,
      :planted_on,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :invoice_no,
      :purchase_order_no,
      :purchase_date,
      :address,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num,
      :catalogue

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)

      @is_draft = false
      @id = args[:id]
      @facility_strain_id = args[:facility_strain_id]
      @plant_ids = generate_or_extract_plant_ids(args[:plant_ids])
      @location_id = args[:location_id]
      @planted_on = args[:planted_on]
      # @vendor_id = args[:vendor_id] || ''
      @vendor_name = args[:vendor_name] && args[:vendor_name].strip
      @vendor_id = Vendor.find_by(name: args[:vendor_name])&.id
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
      @invoice_no = args[:invoice_no]
      @purchase_order_no = args[:purchase_order_no]
      @purchase_date = args[:purchase_date]
      facility_strain = Inventory::FacilityStrain.find(@facility_strain_id)
      @catalogue = Inventory::Catalogue.find_or_create_by!(label: 'Plant',
                                                           key: 'plant',
                                                           catalogue_type: 'plant',
                                                           category: 'plant',
                                                           is_active: true,
                                                           uom_dimension: 'pieces',
                                                           facility: facility_strain.facility)
    end

    def call
      if valid_permission? && valid_data?
        invoice_item = save_purchase_info

        if id.blank?
          create_mother_plants(invoice_item)
        else
          update_mother_plants(invoice_item)
        end
      end
    end

    private

    def generate_or_extract_plant_ids(ids)
      ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end

    def valid_permission?
      true
    end

    def valid_data?
      if id.blank?
        existing_records = Inventory::Plant.in(plant_id: plant_ids).pluck(:plant_id)
        errors.add(:plant_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.") if existing_records.count > 0
      end

      errors.add(:facility_strain_id, 'Strain is required') if facility_strain_id.blank?
      errors.add(:planted_on, 'Planted date is required') if planted_on.blank?
      valid_location?
      valid_vendor? if is_purchased?
      errors.empty?
    end

    def valid_location?
      errors.add(:location_id, 'Mother room is required') if location_id.blank?

      facility_strain = Inventory::FacilityStrain.find(facility_strain_id)
      location_exists = Facility.find_by('rooms._id': BSON::ObjectId(location_id), id: facility_strain.facility_id)
      errors.add(:location_id, 'Mother room must be within facility where you register the strain.') if location_id.present? && location_exists.nil?
    end

    def valid_vendor?
      if vendor_id.blank?
        errors.add(:vendor_name, 'Vendor name is required.') if vendor_name.blank?
        errors.add(:vendor_state_license_num, 'State license number is required.') if vendor_state_license_num.blank?
        errors.add(:vendor_state_license_expiration_date, 'State license experiation date is required.') if vendor_state_license_expiration_date.blank?
        errors.add(:vendor_location_license_expiration_date, 'Location expiration date is required.') if vendor_location_license_expiration_date.blank?
        errors.add(:vendor_location_license_num, 'Location license number is required.') if vendor_location_license_num.blank?
      end
    end

    def is_purchased?
      vendor_name.present?
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
      facility_strain = Inventory::FacilityStrain.find(facility_strain_id)
      purchase_order = Inventory::PurchaseOrder.find_or_create_by!(purchase_order_no: purchase_order_no, vendor: vendor) do |po|
        po.purchase_order_date = purchase_date
        po.facility = facility_strain.facility
        po.status = Inventory::PurchaseOrder::RECEIVED_FULL
      end

      po_item = purchase_order.items.find_or_create_by!(facility_strain_id: facility_strain.id) do |item|
        item.catalogue = catalogue
        item.quantity = plant_ids.count
        item.uom = 'pc'
        item.price = 0
        item.currency = 'USD'
        item.tax = 0
        item.description = "PO created from Mother Plant setup - #{plant_ids.join(', ')}"
        item.product_name = "#{facility_strain.strain_name} - Mother Plant"
      end
      po_item
    end

    def save_invoice(po_item)
      return nil if po_item.nil?

      invoice = Inventory::VendorInvoice.find_or_create_by!(
        invoice_no: invoice_no,
        invoice_date: purchase_date,
        facility: po_item.purchase_order.facility,
        purchase_order: po_item.purchase_order,
        vendor: po_item.purchase_order.vendor,
      )

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

    def create_mother_plants(invoice_item)
      plants = []
      plant_ids.each do |plant_id|
        plant = Inventory::Plant.find_or_initialize_by(
          plant_id: plant_id,
          facility_strain_id: facility_strain_id,
        ) do |t|
          t.current_growth_stage = 'mother'
          t.created_by = user
          t.location_id = location_id
          t.location_type = 'room'
          t.status = 'available'
          t.planting_date = planted_on
          t.mother_date = ''
          t.ref_id = invoice_item.present? ? invoice_item.id : nil
          t.ref_type = invoice_item.present? ? invoice_item.class.name : nil
        end
        plant.save!
        plants << plant
      end

      update_po_invoice_count(invoice_item&.id)
      plants
    end

    def update_mother_plants(invoice_item)
      plant = Inventory::Plant.find_by(id: id, current_growth_stage: 'mother')
      old_invoice_item_id = plant.ref_id

      plant.update!(
        plant_id: plant_ids[0],
        facility_strain_id: facility_strain_id,
        cultivation_batch_id: nil,
        location_id: location_id,
        status: is_draft ? 'draft' : 'available',
        planting_date: planted_on,
        ref_id: invoice_item ? invoice_item.id : nil,
        ref_type: invoice_item ? invoice_item.class.name : nil,
      )

      update_po_invoice_count(old_invoice_item_id)
      update_po_invoice_count(invoice_item&.id)
      plant
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
  end
end
