module Inventory
  class PlantWasteSerializer
    include FastJsonapi::ObjectSerializer

    attribute :id do |object|
      object.id&.to_s
    end

    attributes :plant_id,
      :plant_tag,
      :location_type,
      :status,
      :current_growth_stage,
      :wet_weight,
      :wet_weight_uom,
      :lot_number,
      :mother_date,
      :planting_date,
      :veg_date,
      :veg1_date,
      :veg2_date,
      :flower_date,
      :harvest_date,
      :estimated_harvest_date,
      :manifest_no,
      :destroyed_date,
      :destroyed_reason,
      :created_at

    attribute :waste_type do |obj|
      'Destroyed Plant'
    end

    attribute :harvest_id do |obj|
      obj&.harvest_batch&.harvest_name
    end

    attribute :assigned_to do |obj|
      'Christie Ma'
    end

    attribute :net_waste_weight do |obj|
      obj.wet_waste_weight
    end

    attribute :harvest_id do |obj|
      obj&.harvest_batch&.harvest_name
    end

    attribute :planting_date do |obj|
      obj.planting_date&.strftime('%d/%m/%Y')
    end

    attribute :destroyed_date do |obj|
      obj.destroyed_date&.strftime('%d/%m/%Y')
    end

    attribute :cultivation_batch do |object, params = {}|
      if params[:exclude]&.include?(:batch)
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

    attribute :cultivation_batch_name do |object|
      object&.cultivation_batch&.name
    end

    attribute :batch_growth_stage do |object|
      object&.cultivation_batch&.current_growth_stage
    end

    attribute :batch_start_date do |object|
      object&.cultivation_batch&.start_date
    end

    attribute :estimated_harvest_date do |object|
      object&.cultivation_batch&.estimated_harvest_date
    end

    attribute :current_stage_start_date do |object|
      object&.cultivation_batch&.current_stage_start_date
    end

    attribute :strain_name do |object|
      object.facility_strain&.strain_name
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :mother_id do |object|
      object&.mother_id.to_s
    end

    attribute :created_at, &:c_at

    attribute :location_name do |object, params|
      if params[:locations] && object.location_id
        params[:locations].get_location_code(object.location_id)
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
