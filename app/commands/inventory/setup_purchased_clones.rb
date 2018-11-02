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
      :product_name,
      :manufacturer,
      :description,
      :order_quantity,
      :order_uom,
      :qty_per_package,
      :price,
      :location_id,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :invoice_no,
      :purchase_order_no,
      :address,
      :purchase_date

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
      @description = args[:description]
      @manufacturer = args[:manufacturer]
      @quantity = args[:order_quantity]
      @order_quantity = args[:order_quantity]
      @order_uom = args[:order_uom]
      @price = args[:price]
      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]
      @vendor_no = args[:vendor_no]
      @invoice_no = args[:invoice_no]
      @purchase_order_no = args[:purchase_order_no]
      @address = args[:address]
      @purchase_date = args[:purchase_date]
    end

    def call
      if valid_permission? && valid_data?
        invoice_item = save_purchase_info

        if id.blank?
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
      # TODO: Validate data
      true
    end

    def save_purchase_info
      if id.present?
        tx = Inventory::ItemTransaction.find(id)
      end

      vendor = save_vendor
      po_item = save_purchase_order(vendor)
      invoice_item = save_invoice(po_item)
      invoice_item
    end

    def create_clones(invoice_item)
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
      )
    end

    def update_clones(invoice_item)
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

    def save_purchase_order(vendor)
      purchase_order = Inventory::PurchaseOrder.find_or_create_by!(purchase_order_no: purchase_order_no, vendor: vendor) do |po|
        po.purchase_order_date = purchase_date
        po.facility = facility
        po.status = Inventory::PurchaseOrder::INVENTORY_SETUP
      end

      po_item = purchase_order.items.create!(
        catalogue: catalogue,
        quantity: order_quantity,
        uom: order_uom,
        price: price,
        currency: 'USD',
        tax: 0,
        description: description,
        product_name: product_name,
        manufacturer: manufacturer,
        facility_strain: facility_strain,
      )
    end

    def save_invoice(po_item)
      return nil if po_item.nil?

      invoice = Inventory::VendorInvoice.find_or_create_by!(
        invoice_no: invoice_no,
        vendor: po_item.purchase_order.vendor,
      ) do |inv|
        inv.invoice_date = purchase_date
        inv.facility = facility
        inv.purchase_order = po_item.purchase_order
        inv.status = Inventory::VendorInvoice::INVENTORY_SETUP
      end

      invoice_item = invoice.items.create!(
        catalogue: catalogue,
        uom: po_item.uom,
        quantity: po_item.quantity,
        price: price, # TODO: Why not read from po_item.price
        tax: 0,
        currency: po_item.currency,
        description: po_item.description,
        product_name: po_item.product_name,
        manufacturer: manufacturer,
        facility_strain: facility_strain,
      )
    end
  end
end
