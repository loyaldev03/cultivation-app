desc "Set location to plant"

task set_location_to_plant: :environment do

  Cultivation::Batch.all.each do |batch|
    locations = QueryLocations.call(batch.facility_id).result
        if locations.any?
            stage = batch.current_growth_stage || 'clone'
            locs = locations.map{|x| x[:tray_id] if x[:row_purpose] == stage && x[:row_has_trays] }.compact
            location_id = locs.sample
            location_purpose = locations.detect{|x| x[:tray_id] == location_id}[:row_purpose]
        end
    if batch.plants.any?
        batch.plants.update_all(current_growth_stage: stage, location_id: location_id, location_purpose: location_purpose)
    end

    pp "#{batch.start_date} #{batch.batch_no} batch updated"
  end
 
end
