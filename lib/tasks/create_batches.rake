desc "Create dummy batches and tasks"

task create_dummy_batches: :environment do

facility = Facility.find_by(name: "DEMO F15")
strains = facility.strains
grow_methods = Common::GrowMethod.all
date = Time.now - 2.months
count = 0
(0..10).each do |b|
  puts "=== Batch Date #{date}"
  (0..1).each do |c|
    puts "      === creating Batch F15-#{count+1}"

    batch = Cultivation::Batch.new
    batch.name = "Batch F15-#{count}"
    count +=1
    batch.facility_id = facility.id.to_s
    batch.batch_source = Constants::PLANT_SOURCE_TYPES.pluck(:code).sample
    batch.facility_strain_id = strains.sample.id.to_s
    # Default start_date to tomorrow
    batch.start_date = date.beginning_of_day
    batch.grow_method = grow_methods.sample.name
    batch.quantity = [2000, 1000, 1500].sample

    last_batch_no = Cultivation::Batch.last&.batch_no
    get_next_batch_no = NextFacilityCode.call(:batch, last_batch_no).result

    batch.batch_no = get_next_batch_no
    batch.save!

    GenerateTasksFromTemplateJob.perform_now(batch.id.to_s)

  end
  date = date + 2.week
end


end
