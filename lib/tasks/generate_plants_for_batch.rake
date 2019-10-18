desc "Create dummy plants for batches"

task generate_plants_for_batch: :environment do
  facility = Facility.find_by(name: "DEMO F15")

  batches = Cultivation::Batch.where(facility_id: facility.id,
                                     :start_date.lte => Time.current).to_a
  ##
  #batches = Cultivation::Batch.where(id: "5da968e2c62baa42b03974ac").to_a
  batches.each do |batch|
    if batch.status == Constants::BATCH_STATUS_DRAFT
      batch.status = Constants::BATCH_STATUS_SCHEDULED
    end

    if !batch.plants.blank?
      # Delete existing plants
      Inventory::Plant.delete_all(cultivation_batch_id: batch.id)
    end
    plants = []
    plant_id = (Time.now.to_f * 1000).to_i
    batch.quantity.times do |index|
      plants << {
        cultivation_batch_id: batch.id,
        plant_id: plant_id + index,
        current_growth_stage: "clone",
        planting_date: batch.start_date,
        facility_strain_id: batch.facility_strain_id,
        # facility_id: batch.facility_id,
      }
    end
    Inventory::Plant.create(plants)
    pp "#{batch.start_date} #{batch.batch_no} #{plants.length}"
    # Inventory::Plant.create(
    #   cultivation_batch_id: batch.id,
    #   plant_id: plant_id,
    #   plant_tag: plant_id,
    #   planting_date: Time.current,
    #   mother_id: mother_id,
    #   facility_strain_id: batch.facility_strain_id,
    #   modifier_id: user_id,
    # )
    #
    batch.save!
    Cultivation::ActivateBatch.call(Time.current, batch.id)
  end
end
