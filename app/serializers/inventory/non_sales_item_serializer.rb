module Inventory
  class NonSalesItemSerializer
    include FastJsonapi::ObjectSerializer

    attributes :product_name, :order_quantity, :order_uom, :quantity, :uom, :manufacturer, :description, :conversion

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

    attribute :product do |object|
      if object.product
        {
          id: object.product.id.to_s,
          name: object.product.name,
          sku: object.product.sku,
          status: object.product.status,
          transaction_limit: object.product.transaction_limit,
          description: object.product.description,
          manufacturer: object.product.manufacturer,
          upc: object.product.upc,
        }
      else
        nil
      end
    end
  end
end
