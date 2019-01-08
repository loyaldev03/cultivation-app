# This is use by ItemTransaction to format fields that is needed for raw material api
module Inventory
  class RawMaterialSerializer
    include FastJsonapi::ObjectSerializer

    attributes :order_quantity, :order_uom, :quantity, :uom, :manufacturer, :description, :conversion

    attribute :product_name do |object|
      object.product.name
    end

    attribute :description do |object|
      object.product.description
    end

    attribute :manufacturer do |object|
      object.product.manufacturer
    end

    attribute :facility_id do |object|
      object.facility_id.to_s
    end

    attribute :facility_name do |object|
      object.facility.name
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

    attribute :vendor, if: Proc.new { |record, params|
               params && params[:include]&.include?(:vendor) && record.ref_id.present?
             } do |object, params|
      item = params[:relations][:vendor_invoice_items].detect { |x| x.id == object.ref_id }
      vendor = item.invoice.vendor
      {
        id: vendor.id.to_s,
        name: vendor.name,
        vendor_no: vendor.vendor_no,
        address: vendor.address,
        state_license_num: vendor.state_license_num,
        state_license_expiration_date: vendor.state_license_expiration_date,
        location_license_expiration_date: vendor.location_license_expiration_date,
        location_license_num: vendor.location_license_num,
      }
    end

    attribute :purchase_order, if: Proc.new { |record, params|
                       params && params[:include]&.include?(:purchase_order) && record.ref_id.present?
                     } do |object, params|
      item = params[:relations][:vendor_invoice_items].detect { |x| x.id == object.ref_id }
      po = item.invoice.purchase_order
      {
        id: po.id.to_s,
        purchase_order_no: po.purchase_order_no,
        purchase_order_date: po.purchase_order_date,
      }
    end

    attribute :vendor_invoice, if: Proc.new { |record, params|
                       params && params[:include]&.include?(:vendor_invoice) && record.ref_id.present?
                     } do |object, params|
      item = params[:relations][:vendor_invoice_items].detect { |x| x.id == object.ref_id }
      {
        id: item.invoice_id.to_s,
        invoice_no: item.invoice.invoice_no,
        invoice_date: item.invoice.invoice_date,
        item_price: item.price,
        item_currency: item.currency,
      }
    end

    attribute :facility_strain, if: Proc.new { |record, params|
                        params && params[:include]&.include?(:facility_strain)
                      } do |object, params|
      {
        id: object.facility_strain_id.to_s,
        strain_name: object.facility_strain.strain_name,
      }
    end
  end
end
