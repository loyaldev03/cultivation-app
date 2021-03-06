module Inventory
  class SetupRawMaterial
    prepend SimpleCommand

    attr_reader :user,
                :args,
                :is_draft,
                :id,
                :facility_id,
                :facility,
                :location_id,
                :catalogue_id,
                :catalogue,
                :product_id,
                :product_name,
                :product_uom,
                :product_size,
                :product_ppm,
                :epa_number,
                :description,
                :manufacturer,
                :upc,
                :quantity,
                :uom,
                :price,
                :order_quantity,
                :order_uom,
                :qty_per_package,
                :vendor_id, # For purchase info
                :vendor_name,
                :vendor_no,
                :invoice_no,
                :purchase_order_no,
                :address,
                :purchase_date,
                :purchase_order_id,  # For update purpose
                :purchase_order_item_id,
                :invoice_id,
                :invoice_item_id,
                :nitrogen,
                :prosphorus,
                :potassium,
                :nutrients,
                :attachments

    def initialize(user, args)
      @args = args
      @user = user

      @id = args[:id]
      @facility_id = args[:facility_id]
      @facility = Facility.find(@facility_id)

      @location_id = args[:location_id]
      @catalogue_id = args[:catalogue]
      @catalogue = Inventory::Catalogue.find(@catalogue_id)
      @product_id = args[:product_id]
      @product_name = args[:product_name]
      @description = args[:description]
      @manufacturer = args[:manufacturer]
      @upc = args[:upc]
      @product_uom = args[:product_uom]
      @product_size = args[:product_size]
      @product_ppm = args[:product_ppm]
      @epa_number = args[:epa_number]

      @quantity = args[:quantity]
      @uom = args[:uom]
      @order_quantity = args[:order_quantity]
      @order_uom = args[:order_uom]
      @price = args[:price]
      @qty_per_package = args[:qty_per_package]

      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_no = args[:vendor_no]
      @invoice_no = args[:invoice_no]
      @purchase_order_no = args[:purchase_order_no]
      @address = args[:address]
      @purchase_date = args[:purchase_date]

      @purchase_order_id = args[:purchase_order_id]
      @invoice_id = args[:invoice_id]
      @purchase_order_item_id = nil
      @invoice_item_id = nil
      @nitrogen = args[:nitrogen]
      @prosphorus = args[:prosphorus]
      @potassium = args[:potassium]
      @nutrients = args[:nutrients]
      @attachments = args[:attachments]
    end

    def call
      if valid_permission? && valid_data?
        product = save_product
        invoice_item = save_purchase_info(product)

        raw_material = if id.blank?
                         create_raw_material(invoice_item, product)
                       else
                         update_raw_material(invoice_item, product)
                       end

        ::CalculateAverageProductPriceJob.perform_in(3.seconds, product_id)
        raw_material
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

      errors.add(:facility_id, 'Facility is required') if facility_id.blank?
      errors.add(:uom, 'Unit of measure is required') if uom.blank?
      errors.add(:order_uom, 'Order unit of measure is required') if order_uom.blank?
      errors.add(:order_quantity, 'Order quantity should be more than zero') if order_quantity.to_f <= 0
      errors.add(:quantity, 'Quantity should be more than zero') if quantity.to_f <= 0
      errors.add(:qty_per_package, 'Quantity per package is required') if qty_per_package.blank?
      errors.add(:catalogue, 'Catalogue is required') if catalogue.nil?
      errors.add(:location_id, 'Location is required') if location_id.nil?
      errors.add(:purchase_order_no, 'Purchase order no is required') if purchase_order_no.blank?
      errors.add(:purchase_date, 'Purchase date is required') if purchase_date.blank?
      errors.add(:invoice_no, 'Invoice No is required') if invoice_no.blank?

      unless product_id.blank?
        product = Inventory::Product.find(product_id)
        errors.add(:product, 'This product belongs to another facility, please do you data entry again.') if product.facility_id.to_s != facility_id
      end

      errors.empty?
    end

    # Update/ create necessary purchase info
    def save_purchase_info(product)
      handle_po_invoice_switching
      vendor = save_vendor
      po_item = save_purchase_order(vendor, product)
      invoice_item = save_invoice(po_item, product)

      invoice_item
    end

    def create_raw_material(invoice_item, product)
      Inventory::ItemTransaction.create!(
        ref_id: invoice_item.id,
        ref_type: 'Inventory::VendorInvoiceItem',
        event_type: 'inventory_setup',        # Move to Constants
        event_date: purchase_date,            # stock intake happen today
        facility: facility,
        catalogue: catalogue,
        product_name: invoice_item.product_name,
        description: invoice_item.description,
        manufacturer: invoice_item.manufacturer,
        uom: uom,
        quantity: quantity,
        order_quantity: order_quantity,          # quantity inside PO and stock receive
        order_uom: order_uom,               # uom inside PO and stock receive
        conversion: qty_per_package,         # conversion rule, 1 bag = 65 kg
        facility_strain: nil,
        location_id: location_id,
        product_id: product.id,
      )
    end

    def update_raw_material(invoice_item, product)
      transaction = Inventory::ItemTransaction.find(id)
      transaction.ref_id = invoice_item.id
      transaction.event_date = purchase_date

      transaction.facility = facility
      transaction.location_id = location_id

      transaction.order_quantity = order_quantity
      transaction.order_uom = order_uom
      transaction.uom = uom
      transaction.quantity = quantity
      transaction.conversion = qty_per_package
      transaction.catalogue = catalogue
      transaction.product_name = product_name
      transaction.description = description
      transaction.manufacturer = manufacturer
      transaction.product_id = product.id
      transaction.save!
      transaction
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
      )

      if command.success?
        command.result
      else
        combine_errors(command.errors, :vendor_name, :name)
        combine_errors(command.errors, :vendor_no, :vendor_no)
        combine_errors(command.errors, :address, :address)
        nil
      end
    end

    def save_purchase_order(vendor, product)
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
      po_item.product_id = product.id

      po.save!
      po_item.save!
      po_item
    end

    def save_invoice(po_item, product)
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
      invoice_item.product_id = product.id

      invoice.save!
      invoice_item.save!
      invoice_item
    end

    def save_product
      if product_id.present?
        product = Inventory::Product.find(product_id)
        uom_dimension = Common::UnitOfMeasure.find_by(unit: uom)&.dimension
        product.name = product_name
        product.manufacturer = manufacturer
        product.upc = upc
        product.description = description
        product.catalogue = catalogue
        product.facility = facility
        product.common_uom = product_uom
        product.order_uom = uom
        product.size = product_size
        product.ppm = product_ppm
        product.uom_dimension = uom_dimension
        product.epa_number = epa_number
      else
        uom_dimension = Common::UnitOfMeasure.find_by(unit: uom)&.dimension
        product = Inventory::Product.new(
          name: product_name,
          manufacturer: manufacturer,
          upc: upc,
          description: description,
          catalogue: catalogue,
          facility: facility,
          order_uom: uom,
          common_uom: product_uom,
          size: product_size,
          ppm: product_ppm,
          epa_number: epa_number,
          uom_dimension: uom_dimension,
        )
      end
      save_attachments(product)
      save_npk(product)
      product.save!
      product
    end

    def save_attachments(product)
      if product.attachments.present?
        product.attachments.each do |file|
          found = attachments.detect { |f| f[:id] == file.id.to_s }
          if found.nil?
            file.delete
          end
        end
      end

      if attachments.present?
        attachments.each do |file|
          if file[:id].blank?
            new_file = product.attachments.build
            new_file.file = file[:data] # <json string>
          end
        end
      end
    end

    def save_npk(product)
      nutrients_data = [
        {element: 'nitrogen', value: nitrogen},
        {element: 'prosphorus', value: prosphorus},
        {element: 'potassium', value: potassium},
      ]
      if nutrients.present?
        nutrients.each do |nutrient|
          nutrients_data << {element: nutrient['element'], value: nutrient['value']}
        end
      end
      product.nutrients = []
      nutrients_data.each do |data|
        product.nutrients.build(element: data[:element], value: data[:value])
      end
    end

    def nutrients?
      catalogue.category == 'nutrients'
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
