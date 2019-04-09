class MovePlantsToNextPhaseJob < ApplicationJob
  queue_as :low

  # Call this job when user complated the moving task.
  def perform(batch_id)
    batch = Cultivation::Batch.find(batch_id.to_bson_id)
    existing_plants = Inventory::Plant.where(cultivation_batch_id: batch.id)
    histories = Cultivation::PlantMovementHistory.where(batch_id: batch.id)

    # Make sure clipping records are converted into plants
    if batch.current_growth_stage == Constants::CONST_CLONE
      # Clipping mother plants into clones
      histories.where(activity: Constants::INDELIBLE_CLIP_POT_TAG).each do |his|
        his.plants.each do |plant_tag|
          exist = existing_plants.detect { |x| x.plant_tag == plant_tag }
          if !exist
            Inventory::Plant.create(
              cultivation_batch_id: batch.id,
              plant_id: plant_tag,
              plant_tag: plant_tag,
              created_by_id: his.user_id,
              planting_date: Time.zone.now,
              mother_id: his.mother_plant_id,
              facility_strain_id: batch.facility_strain_id,
              modifier_id: his.user_id,
            )
          end
        end
      end

      # Moving into trays
      histories.where(activity: Constants::INDELIBLE_MOVING_TO_TRAY).each do |his|
        his.plants.each do |plant_tag|
          plant = existing_plants.detect { |x| x.plant_tag == plant_tag }
          if plant.present?
            plant.location_id = his.destination_id
            plant.location_type = his.destination_type
            plant.current_growth_stage = Constants::CONST_CLONE
            plant.modifier_id = his.user_id
            plant.save!
          end
        end
      end
    end

    # Moving to next phase

    # Detect most recent growth phase based on plants movements history

    # Update batch current_growth_stage
  end
end
