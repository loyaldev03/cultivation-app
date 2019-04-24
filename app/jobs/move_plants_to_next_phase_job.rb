class MovePlantsToNextPhaseJob < ApplicationJob
  queue_as :low

  attr_reader :batch_id

  # Call this job when user complated the moving task.
  def perform(batch_id)
    @batch_id = batch_id.to_bson_id
    if batch.current_growth_stage == Constants::CONST_CLONE
      # Clipping
      clip_records = histories.where(
        activity: Constants::INDELIBLE_CLIP_POT_TAG,
        phase: Constants::CONST_CLONE,
      )
      # Create a plant record if there's a clipping record
      clip_records.each do |rec|
        if rec.task&.work_status == Constants::WORK_STATUS_DONE
          create_or_update_plants(rec.plants, rec.mother_plant_id, rec.user_id)
        end
      end
      # Moving clippings into trays
      move_records = histories.where(
        activity: Constants::INDELIBLE_MOVING_TO_TRAY,
        phase: batch.current_growth_stage,
      )
    else
      # Moving into next phase
      move_records = histories.where(
        activity: Constants::INDELIBLE_MOVING_NEXT_PHASE,
        phase: batch.current_growth_stage,
      )
    end
    move_records.each do |rec|
      if rec.task&.work_status == Constants::WORK_STATUS_DONE
        create_or_update_plants(rec.plants,
                                rec.mother_plant_id,
                                rec.user_id,
                                rec.destination_id,
                                rec.destination_type)
      end
    end
  end

  private

  def batch
    @batch ||= Cultivation::Batch.includes.find(batch_id)
  end

  def existing_plants
    @existing_plants ||= Inventory::Plant.where(cultivation_batch_id: batch.id)
  end

  def histories
    @histories ||= Cultivation::PlantMovementHistory.
      includes(:task).
      where(batch_id: batch.id)
  end

  def create_or_update_plants(plant_ids,
                              mother_plant_id,
                              user_id,
                              dest_id = nil,
                              dest_type = nil)
    plant_ids.each do |plant_id|
      exist = existing_plants.detect { |p| p.plant_id == plant_id }
      if exist.nil?
        create_plant(plant_id, mother_plant_id, user_id)
      end
      if dest_id && dest_type
        update_plant(plant_id, user_id, dest_id, dest_type)
      end
    end
  end

  def create_plant(plant_id, mother_id, user_id)
    Inventory::Plant.create(
      cultivation_batch_id: batch.id,
      plant_id: plant_id,
      plant_tag: plant_id,
      planting_date: Time.current,
      mother_id: mother_id,
      facility_strain_id: batch.facility_strain_id,
      created_by_id: user_id,
      modifier_id: user_id,
    )
  end

  def update_plant(plant_id, user_id, dest_id, dest_type)
    plant = existing_plants.detect { |x| x.plant_id == plant_id }
    stage = batch.current_growth_stage
    if plant.present?
      plant.location_id = dest_id
      plant.location_type = dest_type
      plant.current_growth_stage = stage
      plant.modifier_id = user_id
      plant.veg_date ||= Time.current if stage == Constants::CONST_VEG
      plant.veg1_date ||= Time.current if stage == Constants::CONST_VEG1
      plant.veg2_date ||= Time.current if stage == Constants::CONST_VEG2
      plant.flower_date ||= Time.current if stage == Constants::CONST_FLOWER
      plant.save
    end
  end
end
