module Inventory
  class PlantSerializer
    include FastJsonapi::ObjectSerializer

    attributes :plant_id,
      :plant_tag,
      :location_type,
      :status,
      :current_growth_stage,
      :wet_weight,
      :wet_weight_uom,
      :lot_number

    attribute :strain_name do |object|
      object.facility_strain.strain_name
    end

    attribute :created_by_id do |object|
      object.created_by_id.to_s
    end

    attribute :cultivation_batch do |object, params = {}|
      if params[:exclude] && params[:exclude].include?(:batch)
        ''
      elsif object.cultivation_batch.nil?
        ''
      else
        "#{object.cultivation_batch.batch_no} - #{object.cultivation_batch.name}"
      end
    end

    attribute :cultivation_batch_id do |object|
      object.cultivation_batch_id.to_s
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :mother_date do |object|
      object.mother_date.iso8601 if object.mother_date
    end

    attribute :planting_date do |object|
      object.planting_date.iso8601 if object.planting_date
    end

    attribute :veg_date do |object|
      object.veg_date.iso8601 if object.veg_date
    end

    attribute :veg1_date do |object|
      object.veg1_date.iso8601 if object.veg1_date
    end

    attribute :veg2_date do |object|
      object.veg2_date.iso8601 if object.veg2_date
    end

    attribute :flower_date do |object|
      object.flower_date.iso8601 if object.flower_date
    end

    attribute :harvest_date do |object|
      object.harvest_date.iso8601 if object.harvest_date
    end

    attribute :expected_harvest_date do |object|
      object.expected_harvest_date.iso8601 if object.expected_harvest_date
    end

    attribute :mother_id do |object|
      (object.mother_id || '').to_s
    end

    attribute :created_at do |object|
      object.c_at.iso8601
    end

    attribute :location_name do |object, params|
      if params[:query] && object.location_id
        params[:query].get_location_code(object.location_id)
      else
        ''
      end
    end

    attribute :vendor_invoice,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:vendor_invoice) && record.ref_id.present?
      } do |object|
      item = Inventory::VendorInvoiceItem.find(object.ref_id)
      {
        id: item.invoice_id.to_s,
        invoice_no: item.invoice.invoice_no,
        invoice_date: item.invoice.invoice_date,
      }
    end

    attribute :purchase_order,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:purchase_order) && record.ref_id.present?
      } do |object|
      item = Inventory::VendorInvoiceItem.find(object.ref_id)
      po = item.invoice.purchase_order
      {
        id: po.id.to_s,
        purchase_order_no: po.purchase_order_no,
      }
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
        state_license_num: vendor.state_license_num,
        state_license_expiration_date: vendor.state_license_expiration_date,
        location_license_expiration_date: vendor.location_license_expiration_date,
        location_license_num: vendor.location_license_num,
      }
    end

    attribute :mother,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:mother)
      } do |object|
      if object.mother_id.blank?
        nil
      else
        mother = Inventory::Plant.find(object.mother_id)
        {
          id: mother.id.to_s,
          plant_id: mother.plant_id,
        }
      end
    end
  end
end
