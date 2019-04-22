module Inventory
  class SetupHarvestBatch
    prepend SimpleCommand

    attr_reader :user,
      :args,
      :id,
      :is_draft,
      :cultivation_batch_id,
      :batch,
      :harvest_name,
      :harvest_date,
      :plant_args,
      :uom,
      :delete_plants

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      @id = args[:id]
      @is_draft = false
      @cultivation_batch_id = args[:cultivation_batch_id]
      @batch = Cultivation::Batch.find(args[:cultivation_batch_id])
      @harvest_name = args[:harvest_name]
      @harvest_date = args[:harvest_date]
      @uom = args[:uom]
      @delete_plants = args[:delete_plants]
      @plant_args = build_plant_args(
        args[:plants],
        args[:location_id],
        args[:uom],
        args[:vendor_id],
        args[:vendor_name],
        args[:vendor_no],
        args[:address],
        args[:purchase_order_no],
        args[:purchase_date],
        args[:purchase_order_id],
        args[:purchase_order_item_id],
        args[:invoice_no],
        args[:invoice_id],
        args[:invoice_item_id],
        args[:vendor_state_license_num],
        args[:vendor_state_license_expiration_date],
        args[:vendor_location_license_expiration_date],
        args[:vendor_location_license_num]
      )
    end

    def call
      if valid_user? && valid_data?
        plants = save_plants!
        harvest_batch = save_harvest_batch(plants)
        delete_plants!
        harvest_batch
      end
    end

    def valid_user?
      true
    end

    def valid_data?
      errors.add(:harvest_name, 'Harvest name is required') if harvest_name.blank?
      errors.add(:cultivation_batch_id, 'Cultivation batch is required') if cultivation_batch_id.blank?
      errors.add(:harvest_date, 'Harvest date is required') if harvest_date.blank?
      errors.add(:uom, 'Measurement unit is required') if uom.blank?

      if plant_args.empty?
        errors.add(:plants, 'At least a plant is required')
      else
        plant_args.each do |plant_arg|
          validation = Inventory::SetupPlantsV2.new(user, plant_arg).prevalidate
          validation.values.uniq.each { |message| errors.add(:plants, message) }
        end
      end
      errors.empty?
    end

    def build_plant_args(plants, location_id, uom,
                         vendor_id, vendor_name, vendor_no, address,
                         purchase_order_no, purchase_date, purchase_order_id, purchase_order_item_id,
                         invoice_no, invoice_id, invoice_item_id,
                         vendor_state_license_num, vendor_state_license_expiration_date, vendor_location_license_expiration_date, vendor_location_license_num)
      plants.map do |plant|
        p = HashWithIndifferentAccess.new(plant)
        p[:cultivation_batch_id] = cultivation_batch_id
        p[:location_id] = location_id
        p[:vendor_id] = vendor_id
        p[:vendor_name] = vendor_name
        p[:vendor_no] = vendor_no
        p[:address] = address
        p[:purchase_order_no] = purchase_order_no
        p[:purchase_date] = purchase_date
        p[:purchase_order_id] = purchase_order_id
        p[:purchase_order_item_id] = purchase_order_item_id
        p[:invoice_no] = invoice_no
        p[:invoice_id] = invoice_id
        p[:invoice_item_id] = invoice_item_id
        p[:vendor_state_license_num] = vendor_state_license_num
        p[:vendor_state_license_expiration_date] = vendor_state_license_expiration_date
        p[:vendor_location_license_expiration_date] = vendor_location_license_expiration_date
        p[:vendor_location_license_num] = vendor_location_license_num
        p[:weight_uom] = uom
        p
      end
    end

    def save_harvest_batch(plants)
      harvest_batch = if id.blank?
                        Inventory::HarvestBatch.new(status: 'new')
                      else
                        Inventory::HarvestBatch.find(id)
                      end

      harvest_batch.harvest_name = harvest_name
      harvest_batch.harvest_date = harvest_date
      harvest_batch.facility_strain_id = batch.facility_strain_id
      harvest_batch.cultivation_batch_id = batch.id
      harvest_batch.total_wet_weight = plants.sum { |x| x.wet_weight }
      # harvest_batch.total_wet_waste_weight = plants.sum { |x| x.wet_waste_weight || 0 }
      harvest_batch.uom = uom
      harvest_batch.save!

      plants.each do |p|
        p.harvest_batch = harvest_batch
        p.save!
      end

      harvest_batch
    end

    def save_plants!
      result = []
      plant_args.each do |plant_arg|
        command = Inventory::SetupPlantsV2.call(user, plant_arg)

        if command.success?
          # All plants are saved under same PO & invoice set
          @vendor_invoice_id = command.result.vendor_invoice&.id
          @vendor_id = command.result.vendor_invoice&.vendor_id
          @purchase_order_id = command.result.vendor_invoice&.purchase_order_id
          result << command.result
        else
          raise 'Something went wrong in saving plant. ' + command.errors.inspect
        end
      end

      result
    end

    def delete_plants!
      plants = Inventory::Plant.in(id: delete_plants)
      plants.each do |p|
        next if (p.ref_id.blank? || p.ref_type != 'Inventory::VendorInvoiceItem')

        invoice_item = Inventory::VendorInvoiceItem.find(p.ref_id)
        po_item = invoice_item.purchase_order_item
        po_item.destroy!
        invoice_item.destroy!
      end
      plants.destroy_all
    end
  end
end
