module Common
  class FacilityUserSerializer
    include FastJsonapi::ObjectSerializer
    attributes :first_name,
               :last_name,
               :is_active,
               :title,
               :email,
               :phone_number,
               :badge_id,
               :department,
               :overtime_hourly_rate,
               :hourly_rate,
               :photo_data,
               :user_mode,
               :exempt

    attribute :default_facility_id do |object|
      object.default_facility_id.to_s
    end

    attribute :reporting_manager_id do |object|
      object.reporting_manager_id.to_s
    end

    attribute :photo_url do |object|
      if object.photo_data && object.photo_data != 'null'
        object.photo_url
      else
        ''
      end
    end

    attribute :facilities do |object|
      object.facilities.map(&:to_s)
    end

    attribute :roles do |object|
      object.roles.map(&:to_s)
    end

    attribute :work_schedules do |object|
      days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      work_schedules = days.map do |a|
        day_work = object.work_schedules.detect { |b| b.day == a }
        {
          day: a,
          start_time: day_work&.start_time&.strftime('%H:%M'),
          end_time: day_work&.end_time&.strftime('%H:%M'),
        }
      end
    end

    attributes :non_exempt_schedules do |object|
      non_exempt_schedules = object.work_schedules.select { |a| a[:start_date] and a[:duration] }
      non_exempt_schedules = non_exempt_schedules.map do |schedule|
        {
          id: schedule[:id].to_s,
          start_date: schedule[:start_date]&.strftime('%D'),
          end_date: (schedule[:start_date] + schedule[:duration].days)&.strftime('%D'),
          start_time: schedule[:start_time]&.strftime('%H:%M'),
          end_time: schedule[:end_time]&.strftime('%H:%M'),
        }
      end
    end
  end
end
