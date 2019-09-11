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
      f_ids = @facility_id.split(',').map { |x| x.to_bson_id }
      json = []
      total_percentages = 0
      users = User.where(exempt: false)
      users.map do |user|
        tasks = user.cultivation_tasks.in(facility_id: f_ids).where(work_status: 'done')
        tc = 0
        if tasks.count > 0
          count = 0
          tasks.map do |t|
            if t.time_logs.present?
              t.time_logs.where(user_id: user.id).map { |tl| count += (tl.duration_in_hours) }
            end
            if count <= t.estimated_hours
              tc += 1
            end
          end
          percentage = 100 - (((tasks.count - tc) * 100 / tasks.count).ceil)
          if @role.present?
            if user.display_roles.include?(@role)
              json << {

                first_name: user.first_name,
                last_name: user.last_name,
                percentage: percentage,
                photo_url: user.photo_url,
                roles: @role,
              }
            elsif @role == 'All Job Roles'
              json << {

                first_name: user.first_name,
                last_name: user.last_name,
                percentage: percentage,
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
              percentage: percentage,
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
        new_data = data.sort_by { |e| e[:percentage] }.reverse.first(5)
      else
        new_data = data.sort_by { |e| e[:percentage] }.first(5)
      end
      total_percentages = 0
      new_data.map { |x| total_percentages += x[:percentage] }
      {
        average: new_data.count > 0 ? total_percentages / new_data.count : 0,
        data: new_data,
      }
    end
  end
end
