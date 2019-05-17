module Common
  class FacilityUserRoleSerializer
    include FastJsonapi::ObjectSerializer
    attribute :facilities do |object|
      object.facilities.map do |facility|
        {
          id: facility[:id].to_s,
          name: facility[:name],
          code: facility[:code],
        }
      end
    end

    attribute :roles do |object|
      object.roles.map do |role|
        {
          id: role.id.to_s,
          name: role.name,
          desc: role.desc,
          built_in: (role.built_in || false),
          permissions: role.permissions,
        }
      end
    end

    attribute :modules

    attribute :company_work_schedules do |object|
      days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      work_schedules = days.map do |a|
        day_work = object.company_work_schedules.detect { |b| b.day == a }
        {
          day: a,
          start_time: day_work&.start_time&.strftime('%H:%M'),
          end_time: day_work&.end_time&.strftime('%H:%M'),
        }
      end
    end

    attribute :users do |object|
      object.users.map do |user|
        default_facility_id = user.default_facility_id ? user.default_facility_id.to_s : nil
        reporting_manager_id = user.reporting_manager_id ? user.reporting_manager_id.to_s : nil

        if user.photo_data && user.photo_data != 'null'
          photo_data = user.photo_data
          photo_url = user.photo_url
        end

        days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        work_schedules = days.map do |a|
          day_work = user.work_schedules.detect { |b| b.day == a }
          {
            day: a,
            start_time: day_work&.start_time&.strftime('%H:%M') || '',
            end_time: day_work&.end_time&.strftime('%H:%M') || '',
          }
        end

        non_exempt_schedules = user.work_schedules.select { |a| a[:start_date] and a[:duration] }
        non_exempt_schedules = non_exempt_schedules.map do |schedule|
          {
            id: schedule[:id].to_s,
            start_date: schedule[:start_date]&.strftime('%D'),
            end_date: (schedule[:start_date] + schedule[:duration].days)&.strftime('%D'),
            start_time: schedule[:start_time]&.strftime('%H:%M'),
            end_time: schedule[:end_time]&.strftime('%H:%M'),
          }
        end

        {
          id: user.id.to_s,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          is_active: user.is_active,
          exempt: user.exempt,
          email: user.email,
          title: user.title,
          photo_data: photo_data,
          photo_url: photo_url,
          roles: user.roles.map(&:to_s),
          facilities: user.facilities.map(&:to_s),
          hourly_rate: user.hourly_rate,
          overtime_hourly_rate: user.overtime_hourly_rate,
          default_facility_id: default_facility_id,
          sign_in_count: user.sign_in_count,
          current_sign_in_ip: user.current_sign_in_ip,
          current_sign_in_at: user.current_sign_in_at,
          last_sign_in_at: user.last_sign_in_at,
          last_sign_in_ip: user.last_sign_in_ip,
          user_mode: user.user_mode,
          reporting_manager_id: reporting_manager_id,
          work_schedules: work_schedules,
          non_exempt_schedules: non_exempt_schedules,
        }
      end
    end
  end
end
