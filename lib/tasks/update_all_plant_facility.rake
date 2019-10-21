desc "Update all plants facility"

task update_all_plant_facility: :environment do
  plants = Inventory::Plant.where(facility_id: nil)
  plants.each do |plant|
    if plant.cultivation_batch.present?
        facility_id = plant.cultivation_batch.facility_id
    elsif plant.facility_strain.present?
        facility_id = plant.facility_strain.facility_id
    end
   
    if facility_id.present?
        plant.update_attributes(facility_id: facility_id)
        puts "#{plant.plant_id} updated"
    end
    
  end

  if plants.nil?
    puts "Nothing to update"
  end
end
