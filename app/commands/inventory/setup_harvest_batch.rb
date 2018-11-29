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
      :plants,
      :uom,
      :location_id,
      :purchase_info,
      :delete_plants,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :address,
      :purchase_order_no,
      :purchase_date,
      :purchase_order_id,
      :purchase_order_item_id,
      :invoice_no,
      :invoice_id,
      :invoice_item_id,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      @id = args[:id]
      @is_draft = false
      @cultivation_batch_id = args[:cultivation_batch_id]
      @batch = Cultivation::Batch.find(args[:cultivation_batch_id])
      @harvest_name = args[:harvest_name]
      @harvest_date = args[:harvest_date]

      @plants = args[:plants]
      @delete_plants = args[:delete_plants]
      @uom = args[:uom]
      @location_id = args[:location_id]

      @vendor_id = args[:vendor_id]
      @vendor_name = args[:vendor_name]

      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @purchase_order_no = args[:purchase_order_no]
      @purchase_date = args[:purchase_date]
      @purchase_order_id = args[:purchase_order_id]
      @purchase_order_item_id = args[:purchase_order_item_id]
      @invoice_no = args[:invoice_no]
      @invoice_id = args[:invoice_id]
      @invoice_item_id = args[:invoice_item_id]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
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
      true
    end

    def save_harvest_batch(plants)
      harvest_batch = if id.blank?
                        Inventory::HarvestBatch.new
                      else
                        Inventory::HarvestBatch.find(id)
                      end

      harvest_batch.harvest_name = harvest_name
      harvest_batch.harvest_date = harvest_date
      harvest_batch.facility_strain_id = batch.facility_strain_id
      harvest_batch.cultivation_batch_id = batch.id
      harvest_batch.total_wet_weight = plants.sum { |x| x.wet_weight }
      harvest_batch.total_wet_waste_weight = plants.sum { |x| x.wet_waste_weight || 0 }
      harvest_batch.uom = uom
      harvest_batch.status = 'new'
      harvest_batch.save!

      plants.each do |p|
        p.harvest_batch = harvest_batch
        p.save!
      end

      harvest_batch
    end

    def save_plants!
      result = []
      plants.each do |p|
        plant_args = HashWithIndifferentAccess.new(p)
        plant_args[:cultivation_batch_id] = cultivation_batch_id
        plant_args[:location_id] = location_id
        plant_args[:vendor_id] = vendor_id
        plant_args[:vendor_name] = vendor_name
        plant_args[:vendor_no] = vendor_no
        plant_args[:address] = address
        plant_args[:purchase_order_no] = purchase_order_no
        plant_args[:purchase_date] = purchase_date
        plant_args[:purchase_order_id] = purchase_order_id
        plant_args[:purchase_order_item_id] = purchase_order_item_id
        plant_args[:invoice_no] = invoice_no
        plant_args[:invoice_id] = invoice_id
        plant_args[:invoice_item_id] = invoice_item_id
        plant_args[:vendor_state_license_num] = vendor_state_license_num
        plant_args[:vendor_state_license_expiration_date] = vendor_state_license_expiration_date
        plant_args[:vendor_location_license_expiration_date] = vendor_location_license_expiration_date
        plant_args[:vendor_location_license_num] = vendor_location_license_num
        plant_args[:weight_uom] = uom

        command = Inventory::SetupPlantsV2.call(user, plant_args)

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
      Inventory::Plant.in(id: delete_plants).destroy_all
    end
  end
end
