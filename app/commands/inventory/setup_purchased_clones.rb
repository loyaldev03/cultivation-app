module Inventory
  class SetupPurchasedClones
    prepend SimpleCommand

    attr_reader :user,
      :args,
      :is_draft,
      :id,
      :facility_strain,
      :facility_strain_id,
      :facility,
      :catalogue,
      :product_id,
      :product_name,
      :manufacturer,
      :upc,
      :description,
      :product_uom,
      :product_size,
      :product_ppm,
      :order_quantity,
      :order_uom,
      :price,
      :location_id,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :address,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num,
      :purchase_order_no,
      :purchase_date,
      :invoice_no,
      :purchase_order_id,  # For update purpose
      :purchase_order_item_id,
      :invoice_id,
      :invoice_item_id

    def initialize(user, args)
      @user = user
      @args = args
      @id = args[:id]

      @facility_strain_id = args[:facility_strain_id]
      @facility_strain = Inventory::FacilityStrain.find(facility_strain_id)
      @facility = facility_strain.facility

      @location_id = args[:location_id]
      @catalogue = Inventory::Catalogue.purchased_clones
      @product_name = args[:product_name]
      @product_id = args[:product_id]
      @description = args[:description]
      @manufacturer = args[:manufacturer]
      @upc = args[:upc]
      @product_uom = args[:product_uom]
      @product_size = args[:product_size]
      @product_ppm = args[:product_ppm]

      @quantity = args[:order_quantity]
      @order_quantity = args[:order_quantity]
      @order_uom = args[:order_uom]
      @price = args[:price]

      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]

      @purchase_order_no = args[:purchase_order_no]
      @purchase_date = args[:purchase_date]
      @invoice_no = args[:invoice_no]

      @purchase_order_id = args[:purchase_order_id]
      @invoice_id = args[:invoice_id]
      @purchase_order_item_id = nil
      @invoice_item_id = nil
    end

    def call
      if valid_permission? && valid_data?
        invoice_item = save_purchase_info

        raw_material = if id.blank?
                         create_clones(invoice_item)
                       else
                         update_clones(invoice_item)
                       end
      end
    end

    private

    def valid_permission?
      true
    end

    def valid_data?
      # TODO: Validate that these id are valid e.g. belong to the same facility & vendor
      # invoice_id
      # @invoice_item_id
      # @invoice_id
      # @purchase_order_id
      # @purchase_order_item_id

      errors.add(:facility_strain_id, 'Strain does not belong to any facility') if facility.nil?
      errors.add(:order_uom, 'Order unit of measure is required') if order_uom.blank?
      errors.add(:order_quantity, 'Order quantity should be more than zero') if order_quantity.to_f <= 0
      errors.add(:catalogue, 'Catalogue is required') if catalogue.nil?
      errors.add(:location_id, 'Location is required') if location_id.nil?
      errors.add(:purchase_order_no, 'Purchase order no is required') if purchase_order_no.blank?
      errors.add(:purchase_date, 'Purchase date is required') if purchase_date.blank?
      errors.add(:invoice_no, 'Invoice No is required') if invoice_no.blank?
      errors.empty?
    end

    def save_purchase_info
      handle_po_invoice_switching
      vendor = save_vendor
      po_item = save_purchase_order(vendor)
      invoice_item = save_invoice(po_item)

      invoice_item
    end

    # If user edit existing inventory but changes to another PO or Invoice,
    # the entry at the old PO or Invoice should be deleted.
    def handle_po_invoice_switching
      return if id.blank?

      transaction = Inventory::ItemTransaction.find(id)
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

    def save_vendor
      command = Inventory::SaveVendor.call(
        id: vendor_id,
        name: vendor_name,
        vendor_no: vendor_no,
        address: address,
        vendor_type: 'normal',
        state_license_num: vendor_state_license_num,
        state_license_expiration_date: vendor_state_license_expiration_date,
        location_license_num: vendor_location_license_num,
        location_license_expiration_date: vendor_location_license_expiration_date,
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :vendor_name, :name)
        combine_errors(command.errors, :vendor_no, :vendor_no)
        combine_errors(command.errors, :address, :address)
        combine_errors(command.errors, :state_license_num, :vendor_state_license_num)
        combine_errors(command.errors, :state_license_num, :vendor_state_license_expiration_date)
        combine_errors(command.errors, :location_license_num, :vendor_location_license_num)
        combine_errors(command.errors, :location_license_expiration_date, :vendor_location_license_expiration_date)
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
      po_item.quantity = order_quantity
      po_item.uom = order_uom
      po_item.price = price
      po_item.currency = 'USD'
      po_item.tax = 0
      po_item.description = description
      po_item.product_name = product_name
      po_item.manufacturer = manufacturer
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
      invoice_item.price = price
      invoice_item.tax = 0
      invoice_item.currency = po_item.currency
      invoice_item.description = po_item.description
      invoice_item.product_name = po_item.product_name
      invoice_item.manufacturer = manufacturer
      invoice_item.purchase_order_item = po_item
      invoice_item.facility_strain = facility_strain

      invoice.save!
      invoice_item.save!
      invoice_item
    end

    def create_clones(invoice_item)
      product = save_product

      Inventory::ItemTransaction.create!(
        ref_id: invoice_item.id,
        ref_type: 'Inventory::VendorInvoiceItem',
        event_type: 'inventory_setup',            # TODO: Move to Constants
        event_date: purchase_date,                # stock intake happen today
        facility: facility,
        catalogue: catalogue,
        product_name: invoice_item.product_name,
        description: invoice_item.description,
        manufacturer: invoice_item.manufacturer,
        uom: order_uom,
        quantity: order_quantity,
        order_quantity: order_quantity,           # quantity inside PO and stock receive
        order_uom: order_uom,                     # uom inside PO and stock receive
        conversion: 1,                            # conversion rule, 1 bag = 65 kg
        facility_strain: facility_strain,
        location_id: location_id,
        product_id: product.id,
      )
    end

    def update_clones(invoice_item)
      product = save_product

      transaction = Inventory::ItemTransaction.find(id)
      transaction.ref_id = invoice_item.id
      transaction.event_date = purchase_date

      transaction.facility = facility
      transaction.facility_strain = facility_strain
      transaction.location_id = location_id

      transaction.order_quantity = order_quantity
      transaction.order_uom = order_uom
      transaction.uom = order_uom
      transaction.quantity = order_quantity
      transaction.conversion = 1
      transaction.catalogue = catalogue
      transaction.product_name = product_name
      transaction.description = description
      transaction.manufacturer = manufacturer
      transaction.product_id = product.id

      transaction.save!
      transaction
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end

    def save_product
      if product_id.present?
        product = Inventory::Product.find(product_id)
        uom_dimension = Common::UnitOfMeasure.find_by(unit: product_uom)&.dimension
        product.update(
          name: product_name,
          manufacturer: manufacturer,
          description: description,
          upc: upc,
          catalogue: catalogue,
          facility: facility,
          facility_strain: facility_strain,
          common_uom: product_uom,
          size: product_size,
          ppm: product_ppm,
          uom_dimension: uom_dimension,
        )
        return product
      else
        uom_dimension = Common::UnitOfMeasure.find_by(unit: product_uom)&.dimension
        return Inventory::Product.create!(
                 name: product_name,
                 manufacturer: manufacturer,
                 description: description,
                 upc: upc,
                 catalogue: catalogue,
                 facility: facility,
                 facility_strain: facility_strain,
                 common_uom: product_uom,
                 size: product_size,
                 ppm: product_ppm,
                 uom_dimension: uom_dimension,
               )
      end
    end
  end
end
