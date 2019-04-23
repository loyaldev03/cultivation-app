module DailyTask
  class SavePlantHarvestWeight
    prepend SimpleCommand

    attr_reader :current_user, :batch_id, :plant_id, :weight, :override,
      :plant, :batch, :harvest_batch

    def initialize(current_user, batch_id, plant_id, weight, override)
      @current_user = current_user
      @batch_id = batch_id
      @plant_id = plant_id
      @weight = weight
      @override = override

      @batch = Cultivation::Batch.find(@batch_id)
      @plant = @batch.plants.find_by(plant_tag: @plant_id)
      @harvest_batch = Inventory::HarvestBatch.find_by(cultivation_batch_id: @batch_id)
    end

    def call
      if validate
        save
      end
    end

    def validate
      errors.add(:plant_id, "#{plant_id} does not exist in this batch.") if plant.nil?
      if plant.present?
        errors.add(:plant_id, "#{plant_id} cannot be used. It has been destroyed.") if plant.destroyed_date.present?
        errors.add(:plant_id, 'Invalid plant status.') if plant.current_growth_stage != Constants::CONST_FLOWER
        errors.add(:harvest_batch, 'Harvest batch is not setup.') if harvest_batch.nil?
        errors.add(:duplicate_plant, '') if (plant.harvest_batch.present? && !override)
      end
      errors.empty?
    end

    def save
      plant.update!(
        wet_weight: weight,
        wet_weight_uom: harvest_batch.uom,
        harvest_date: Time.current,
      )

      harvest_batch.plants << plant

      plants = batch.plants.where(current_growth_stage: Constants::CONST_FLOWER, destroyed_date: nil)
      harvest_batch.update!(
        harvest_date: harvest_batch.harvest_date || Time.current,
        total_wet_weight: plants.sum { |x| x.wet_weight },
      )

      data = {
        total_plants: plants.count,
        total_weighted: harvest_batch.plants.count,
        uom: harvest_batch.uom,
      }
      data
    end
  end
end
