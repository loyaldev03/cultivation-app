module Inventory
  class SaveHarvestBatch
    prepend SimpleCommand

    attr_reader :user,
      :args,
      :id,
      :cultivation_batch_id,
      :batch,
      :harvest_name,
      :harvest_date,
      :location_id,
      :uom

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      @cultivation_batch_id = args[:cultivation_batch_id]
      @batch = Cultivation::Batch.find(args[:cultivation_batch_id])
      @harvest_name = args[:harvest_name]
      @harvest_date = args[:harvest_date]
      @uom = args[:uom]
      @location_id = args[:location_id]
    end

    def call
      if valid_user? && valid_data?
        save_harvest_batch
      end
    end

    def valid_user?
      true
    end

    def valid_data?
      errors.add(:harvest_name, 'Harvest name is required') if harvest_name.blank?
      errors.add(:cultivation_batch_id, 'Cultivation batch is required') if cultivation_batch_id.blank?
      errors.add(:uom, 'Measurement unit is required') if uom.blank?
      errors.add(:location_id, 'Harvest room is required') if location_id.blank?
      errors.empty?
    end

    def save_harvest_batch()
      harvest_batch = Inventory::HarvestBatch.find_or_initialize_by(
        cultivation_batch_id: batch.id,
        facility_strain_id: batch.facility_strain_id,
      )

      harvest_batch.harvest_name = harvest_name
      harvest_batch.harvest_date = harvest_date if harvest_date
      harvest_batch.location_id = location_id
      harvest_batch.uom = uom
      harvest_batch.uom_name = get_uom_name_by_unit(uom)
      harvest_batch.save!
      harvest_batch
    end

    def get_uom_name_by_unit(unit)
      unit_of_measure = Common::UnitOfMeasure.find_by(unit: unit)
      unit_of_measure.name
    end
  end
end
