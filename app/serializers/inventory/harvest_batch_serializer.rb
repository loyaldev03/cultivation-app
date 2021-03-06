module Inventory
  class HarvestBatchSerializer
    include FastJsonapi::ObjectSerializer

    attributes :harvest_name,
      :harvest_name,
      :total_wet_weight,
      :total_wet_waste_weight,
      :uom,
      :status,
      :total_trim_weight,
      :total_trim_waste_weight,
      :total_dry_weight,
      :total_cure_weight

    attribute :id do |object|
      object.id&.to_s
    end

    attribute :cultivation_batch_name do |object|
      "#{object.cultivation_batch.batch_no} - #{object.cultivation_batch.name}"
    end

    attribute :harvest_date do |object|
      object.harvest_date&.iso8601
    end

    attribute :strain_name do |object|
      object.facility_strain.strain_name
    end

    attribute :location do |object|
      facility = Facility.find(object.facility_strain.facility_id)
      facility.rooms.find_by(id: object.location_id)&.full_code
    end

    attribute :location_id do |object|
      object.location_id&.to_s
    end

    attribute :plant_count do |object|
      object.plants.count
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end

    attribute :facility, if: Proc.new { |record, params|
                 params && params[:include]&.include?(:facility)
               } do |object|
      {
        id: object.facility_strain.facility_id.to_s,
        name: object.facility_strain.facility.name,
      }
    end

    attribute :cultivation_batch_id do |object|
      object.cultivation_batch_id.to_s
    end

    attribute :plants, if: Proc.new { |record, params|
               params && params[:include]&.include?(:plants)
             } do |object|
      object.plants.map do |x|
        {
          id: x.id.to_s,
          plant_id: x.plant_id,
          wet_weight: x.wet_weight,
          wet_waste_weight: x.wet_waste_weight,
          wet_weight_uom: x.wet_weight_uom,
        }
      end
    end

    attribute :purchase_order,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:purchase_order)
      } do |object|
      plant = object.plants.first
      if plant.nil? || plant.ref_id.blank?
        nil
      else
        item = Inventory::VendorInvoiceItem.find(plant.ref_id)
        po = item.invoice.purchase_order
        {
          id: po.id.to_s,
          purchase_order_no: po.purchase_order_no,
        }
      end
    end

    attribute :vendor,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:vendor)
      } do |object|
      plant = object.plants.first
      if plant.nil? || plant.ref_id.blank?
        nil
      else
        item = Inventory::VendorInvoiceItem.find(plant.ref_id)
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
    end

    attribute :vendor_invoice,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:vendor_invoice)
      } do |object|
      plant = object.plants.first
      if plant.nil? || plant.ref_id.blank?
        nil
      else
        item = Inventory::VendorInvoiceItem.find(plant.ref_id)
        {
          id: item.invoice_id.to_s,
          invoice_no: item.invoice.invoice_no,
          invoice_date: item.invoice.invoice_date,
        }
      end
    end

    attribute :mother,
      if: Proc.new { |record, params|
        params && params[:include]&.include?(:mother)
      } do |object|
      plant = object.plants.first
      if plant.nil? || plant.ref_id.blank?
        {}
      else
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
end
