desc "Calculate batch cost"

# NOTE: Call this using heroku run rake 'calculate_batch_cost[C18]' -a cannected-beta
# FOR LOCAL: bundle exec rake calculate_batch_cost\['B71'\]
# Assign time long to task of specific batch, using batch_no as param
task :calculate_batch_cost, [:batch_no] => :environment  do |t, args|
  puts args[:batch_no].to_s

  args.with_defaults(:batch_no => "B01")
  batch_no = args.batch_no.to_s
  puts args.batch_no.to_s
  batch = Cultivation::Batch.find_by(batch_no: batch_no)

  batch.tasks.each do |task|
    task.users.each do |user|
      unless user.facilities.include? task.facility_id
        new_facilities = user.facilities
        new_facilities << task.facility_id
        puts new_facilities
        user.facilities = new_facilities
        user.save
      end
    end
  end

  # calculate actual cost task level job
  batch.tasks.each do |task|
    CalculateTotalActualCostJob.perform_now(task.id.to_s)
  end
  # calculate actual cost batch level job
  CalculateTotalActualCostBatchJob.perform_now(batch.id.to_s)
end
