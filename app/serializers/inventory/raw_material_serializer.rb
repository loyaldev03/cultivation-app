# This is use by ItemTransaction to format fields that is needed for raw material api
module Inventory
  class RawMaterialSerializer
    include FastJsonapi::ObjectSerializer

    attributes :product_name, :order_quantity, :order_uom, :quantity, :uom, :manufacturer, :description, :conversion

    attribute :facility_id do |object|
      object.facility_id.to_s
    end

    attribute :catalogue_id do |object|
      object.catalogue_id.to_s
    end

    attribute :catalogue do |object|
      object.catalogue.label
    end

    attribute :location_id do |object|
      object.location_id&.to_s
    end

    attribute :vendor,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:vendor) && record.ref_id.present?
      } do |object|
      item = Inventory::VendorInvoiceItem.find(object.ref_id)
      vendor = item.invoice.vendor
      {
        id: vendor.id.to_s,
        name: vendor.name,
        vendor_no: vendor.vendor_no,
        address: vendor.address,
      }
    end

    attribute :purchase_order, if: Proc.new { |record, params|
                       params && params[:include]&.include?(:purchase_order) && record.ref_id.present?
                     } do |object|
      item = Inventory::VendorInvoiceItem.find(object.ref_id)
      po = item.invoice.purchase_order
      {
        id: po.id.to_s,
        purchase_order_no: po.purchase_order_no,
      }
    end

    attribute :vendor_invoice, if: Proc.new { |record, params|
                       params && params[:include]&.include?(:vendor_invoice) && record.ref_id.present?
                     } do |object|
      item = Inventory::VendorInvoiceItem.find(object.ref_id)
      {
        id: item.invoice_id.to_s,
        invoice_no: item.invoice.invoice_no,
        invoice_date: item.invoice.invoice_date,
        item_price: item.price,
        item_currency: item.currency,
      }
    end
  end
end
