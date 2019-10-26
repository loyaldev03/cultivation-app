desc "Create dummy plants for batches"

task :generate_plants_for_batch, [:batch_no] => :environment  do |t, args|
  args.with_defaults(:batch_no => "B01")
  pp "Generate plants for #{args.batch_no}"
  batch_no = args.batch_no.to_s
  batches = Cultivation::Batch.where(batch_no: batch_no).to_a
  pp "Found batch #{args.batch_no}: #{batches.length}"
  batches.each do |batch|
    Inventory::Plant.where(cultivation_batch_id: batch.id).delete_all
    pp "Generate #{batch.quantity} plants for #{batch.id}"
    plants = []
    plant_id = (Time.now.to_f * 1000).to_i
    if batch.quantity
      batch.quantity.times do |index|
        plants << {
          cultivation_batch_id: batch.id,
          plant_id: plant_id + index,
          current_growth_stage: "clone",
          planting_date: batch.start_date,
          facility_strain_id: batch.facility_strain_id,
          facility_id: batch.facility_id,
        }
      end
    end

    Inventory::Plant.collection.insert_many(plants)

    if batch.status == Constants::BATCH_STATUS_DRAFT
      batch.status = Constants::BATCH_STATUS_SCHEDULED
      batch.save!
      Cultivation::ActivateBatch.call(Time.current, batch.id)
    end
  end
end
