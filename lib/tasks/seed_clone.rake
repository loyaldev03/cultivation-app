desc "Create 15 fake clone data"
task seed_purchased_clones: :environment  do
  facility = Facility.completed.last

  fs = Inventory::FacilityStrain.find_or_initialize_by(
    facility_id: facility.id,
    strain_name: 'AK 47a'
  )

  if !fs.persisted?
    fs.facility = facility
    fs.strain_name = 'AK 47a'
    fs.strain_type = 'sativa'
    fs.created_by = User.last
    fs.save!

    puts "Created facility strain: #{fs.strain_name}"
  end

  15.times do |i|
    p = Inventory::Plant.new
    p.created_by = User.last
    p.facility_strain = fs
    p.plant_id = "P%05d" % i
    p.plant_tag = "T.#{p.plant_id}"
    p.location_id = nil
    p.location_type = "room"
    p.status = "available"
    p.current_growth_stage = "clone"
    p.mother_date = nil
    p.planting_date = 15.days.ago
    p.expected_harvest_date = Date.today + 160.days
    p.last_metrc_update = nil
    p.save

    puts "Created plant: #{p.plant_id}"
  end
end