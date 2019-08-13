module People
  class CompletingTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @facility_id = args[:facility_id]
      @order = args[:order]
      @role = args[:role]
    end

    def call
      date = Time.current
      json = []
      users = User.where(exempt: false)
      users.map do |user|
        tasks = user.cultivation_tasks.where(facility_id: @facility_id)
        if tasks.count > 0
          dones = tasks.where(work_status: 'done').compact
          count = 0
          if dones.count > 0
            dones.map do |t|
              if t.time_logs.present?
                if (t.time_logs.last.end_time.end_of_day <= t.end_date.end_of_day)
                  count += 1
                end
              end
            end
          end
          percentage = ((tasks.count - count) * 100 / tasks.count).ceil
          if @role.present?
            if user.display_roles.include?(@role)
              json << {

                first_name: user.first_name,
                last_name: user.last_name,
                done: count,
                tasks_count: tasks.count,
                percentage: 100 - percentage,
                photo_url: user.photo_url,
                roles: @role,
              }
            elsif @role.nil? or @role == 'All Job Roles'
              json << {

                first_name: user.first_name,
                last_name: user.last_name,
                done: count,
                tasks_count: tasks.count,
                percentage: 100 - percentage,
                photo_url: user.photo_url,
                roles: user.display_roles.join(','),
              }
            else
              json
            end
          else
            json << {
              first_name: user.first_name,
              last_name: user.last_name,
              done: count,
              tasks_count: tasks.count,
              percentage: 100 - percentage,
              photo_url: user.photo_url,
              roles: user.display_roles.join(','),
            }
          end
        end
      end
      display(json)
    end

    def display(data)
      if @order == 'best'
        data.sort_by { |e| e[:percentage] }.reverse.first(5)
      else
        data.sort_by { |e| e[:percentage] }.first(5)
      end
    end
  end
end
