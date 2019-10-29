desc "create and update harvest batch total dry weight for yield count"

task create_total_yield_data: :environment do
  facility_id = Facility.find_by(name: "DEMO F15")&.id
  Cultivation::Batch.in(current_growth_stage: ['harvest', 'dry', 'cure'], facility_id: facility_id).each do |batch|
  #Cultivation::Batch.in(status: ['ACTIVE', 'COMPLETED'], facility_id: facility_id).each do |batch|
    Inventory::HarvestBatch.where(cultivation_batch_id: batch.id).delete_all

    quantity = batch&.quantity
    pp "PLANT QUANTITY #{batch.quantity}"
    if batch&.quantity.present?
      dry_weight = batch&.quantity * 2.0
    else
      dry_weight = 0
    end
    locations = QueryLocations.call(batch.facility_id).result
    locs = locations.map{|x| x[:room_id] if x[:row_purpose] == "dry" ||  x[:row_purpose] == "cure" || x[:row_purpose == "harvest"]}.compact
    location_id = locs.sample

    hbatch = Inventory::HarvestBatch.create!(
      harvest_name: "Harvest #{batch.name}",
      total_dry_weight: dry_weight,
      total_wet_weight: dry_weight,
      facility_strain_id: batch.facility_strain_id,
      cultivation_batch_id: batch.id,
      harvest_date: batch.estimated_harvest_date,
      uom: 'lb',
      location_id: location_id,
      status: 'new'

    )
    
  end

  pp "Done update batch total cure weight"
end
