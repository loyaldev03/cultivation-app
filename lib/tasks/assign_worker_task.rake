desc "Assign worker to task"

task assign_worker_task: :environment do


  batches = Cultivation::Batch.where(name: /^Batch F15/)
  tasks = Cultivation::Task.in(batch_id: batches.pluck(:id)).not_in(indent: [0,1])

  users = User.all

  count = 1
  tasks_count = tasks.count
  tasks.each do |task|
    date = task.start_date..task.end_date
    available_users = []
    users.each do |a|
      ws_count = a.work_schedules.where(date: date)
      if ws_count.count > 0
        available_users << a
      end
    end

    hours_sample = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0].sample

    task.update(estimated_hours: hours_sample, user_ids: available_users.sample(2).pluck(:id))
    puts "saving task ##{count} out of #{tasks_count}"
    puts available_users.count
    count += 1
  end



end
