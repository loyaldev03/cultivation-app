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
      :purchase_info

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
      @uom = args[:uom]
      @location_id = args[:location_id]
      @purchase_info = args.slice(:vendor_id,
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
                                  :vendor_location_license_num)
    end

    def call
      if valid_user? && valid_data?
        plants = save_plants!
        harvest_batch = save_harvest_batch(plants)
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
      harvest_batch.total_wet_waste_weight = plants.sum { |x| x.wet_waste_weight }
      harvest_batch.uom = uom
      harvest_batch.plants.replace(plants)
      harvest_batch.save!
      harvest_batch
    end

    def save_plants!
      plant_args = args.slice(
        :is_draft,
        :cultivation_batch_id,
        :location_id,
        :plants,
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
      ).merge!({
        weight_uom: uom,
      })

      command = Inventory::SetupPlantsV2.call(user, plant_args)
      # raise 'problem' unless command.success?
      Rails.logger.debug "\t\t\t>>> Save plants!"
      Rails.logger.debug command.errors.inspect

      command.result
    end
  end
end
