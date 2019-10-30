desc "Create Plant Wastes"

task :create_wastes_plant => :environment do
    facility_id = Facility.find_by(name: "DEMO F15")&.id
    batches = Cultivation::Batch.where(status: "ACTIVE", facility_id: facility_id) 
    batches.map{|x| x.plants.update_all(wet_weight: nil, wet_waste_weight: nil, wet_weight_uom: nil, destroyed_date: nil, destroyed_reason: nil) if x.plants.any?}
    batches.each do |batch|
        reason = ["Overwatering", "Lack of humidity", "Fungal diseases", "Over-fertilizing"].sample
        if batch.plants.any?
            batch.plants.each_with_index do |plant, i|
                break if i > 10
                plant.update_attributes(wet_weight: rand(100..500).to_s, wet_waste_weight: rand(2..100).to_s, wet_weight_uom: 'lb', destroyed_date: Faker::Date.between(plant.planting_date, (plant.planting_date + 20.days)), destroyed_reason: reason)
            end 
        end
    end


end