class MovePlantsToNextPhaseJob < ApplicationJob
  queue_as :low

  # Call this job when user complated the moving task.
  def perform(batch_id)
    batch = Cultivation::Batch.includes.find(batch_id.to_bson_id)
    existing_plants = Inventory::Plant.where(cultivation_batch_id: batch.id)
    histories = Cultivation::PlantMovementHistory.where(batch_id: batch.id)

    if batch.current_growth_stage == Constants::CONST_CLONE
      # Make sure clipping records are converted into plants
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
            plant.current_growth_stage = batch.current_growth_stage
            plant.modifier_id = his.user_id
            plant.save!
          end
        end
      end
    else
      histories.where(
        activity: Constants::INDELIBLE_MOVING_NEXT_PHASE,
        phase: batch.current_growth_stage,
      ).each do |his|
        his.plants.each do |plant_tag|
          plant = existing_plants.detect { |x| x.plant_tag == plant_tag }
          if plant.present?
            plant.location_id = his.destination_id
            plant.location_type = his.destination_type
            plant.current_growth_stage = batch.current_growth_stage
            plant.modifier_id = his.user_id
            plant.save!
          end
        end
      end

      # growth_stages = facility.growth_stages
      # # Detect most recent growth phase based on plants movements history
      # @sorted_activities = histories.pluck(:phase).sort_by do |h|
      #   [growth_stages.index { |s| h.starts_with?(s) }]
      # end
      # most_recent_phase = @sorted_activities[-1]
      # if most_recent_phase != Constants::CONST_CLONE
      #   curr_phase_index = growth_stages.index(most_recent_phase)
      #   next_phase = growth_stages[curr_phase_index + 1]
      #   # Moving to trays of next phase
      # end
      # Update batch current_growth_stage
    end
  end
end
