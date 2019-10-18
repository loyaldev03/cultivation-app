desc "Create time log"

task create_time_log: :environment do

batches = Cultivation::Batch.where(name: /^Batch F15/)
tasks = Cultivation::Task.in(batch_id: batches.pluck(:id)).not_in(indent: [0,1])

count = 1
tasks.each do |task|
  if task.user_ids.count > 0 
    users = task.users
    users.each do |u|
      #time_log
      random_start_hours = rand(1..23)
      random_start_minutes = rand(01..59)

      start_time_log = Time.new(2019, 1, 1, random_start_hours, random_start_minutes)
      random_hours = rand(1..12)
      end_time_log = start_time_log + random_hours.hours
      time_log = u.time_logs.new(
        start_time: start_time_log,
        end_time: end_time_log,
        task_id: task.id,
        user: u
      )      
      time_log.save
      count += 1

      puts "saved ##{count} time log"
    end
  end
end

end
