module Charts
  class UnassignedTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batch_tasks = Cultivation::Task.where(:batch_id.nin => ['', nil]).where(user_ids: nil).group_by(&:batch_id)
      json_array = []
      batch_tasks.map do |batch, tasks|
        if tasks.last.batch && tasks.last.batch.status == 'ACTIVE'
          json_array << {
            batch: tasks.last.batch.batch_no,
            tasks: tasks.map do |task|
              {
                id: task.id.to_s,
                name: task.name,
                batch_id: task.batch_id.to_s,
                start_date: task.start_date.to_date,
                end_date: task.end_date.to_date,
                user_ids: task.user_ids,
              }
            end,
          }
        end
      end
      json_array
    end
  end
end
