task :generate_time_log, [:batch_id] => :environment do |t, args|
  batch = Cultivation::Batch.find(args[:batch_id])
  tasks = batch.tasks

  Time.use_zone(batch.facility.timezone) do
    tasks.each do |t|
      next if (t.users.empty? || t.estimated_hours <= 0)
      return if t.start_date >= Time.current.beginning_of_day

      t.update(work_status: 'done')
      duration = (t.estimated_hours * 0.7) + (rand() * t.estimated_hours * 0.62)
      start_time = Time.new(t.start_date.year, t.start_date.month, t.start_date.day, 8, 0)
      puts [t.estimated_hours, duration]
      puts start_time

      t.users.each do |u|
        end_time = (start_time + (duration/ t.users.count).hours)
        time_log = t.time_logs.new(start_time: start_time, end_time: end_time, user: u)
        puts end_time
        puts "\n"
        time_log.save!
      end

      CalculateTotalActualCostJob.perform_later(t.id.to_s)
    end

    CalculateTotalActualCostBatchJob.perform_later(batch_id.to_s)
  end
end

