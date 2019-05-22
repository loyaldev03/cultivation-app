class SaveUser
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {}, current_user)
    @args = args
    @current_user = current_user
  end

  def call
    if args[:id]
      user = User.find(args[:id])
      user.email = args[:email]
      user.password = args[:password]
      user.first_name = args[:first_name]
      user.last_name = args[:last_name]
      user.phone_number = args[:phone_number]
      user.title = args[:title]
      if args[:photo_data].blank?
        user.photo = nil
      else
        user.photo_data = args[:photo_data]
      end
      user.is_active = args[:is_active]
      user.exempt = args[:exempt]
      user.hourly_rate = args[:hourly_rate]
      user.overtime_hourly_rate = args[:overtime_hourly_rate]
      user.user_mode = args[:user_mode]
      user.reporting_manager_id = if args[:reporting_manager_id]
                                    args[:reporting_manager_id].to_bson_id
                                  end
      #date exist == non exempt schedule
      #day exist == exempt schedule
      #clear exempt schedule and insert all back
      #but for non exempt cant do that got many dates

      if args[:exempt]
        #exempt worker
        user.work_schedules = user.work_schedules.select { |a| a[:date] }
        args[:work_schedules].map do |a|
          user.work_schedules.build(
            day: a[:day],
            start_time: a[:start_time] ? Time.zone.parse(a[:start_time], Time.current) : '',
            end_time: a[:end_time] ? Time.zone.parse(a[:end_time], Time.current) : '',
          )
        end
      else
        #non-exempt worker
        args[:non_exempt_schedules].map do |a|
          # check if start_time and end_time nil, try find the record and remove
          if a[:start_time] == '' and a[:end_time] == ''
            # remove schedule when start_time and end_time doesnt exist
            user.work_schedules = user.work_schedules.reject { |b| b[:date] == Time.zone.parse(a[:date], Time.current) }
          else
            work_schedule = user.work_schedules.detect { |c| c[:date]&.beginning_of_day == Time.zone.parse(a[:date], Time.current)&.beginning_of_day }
            if work_schedule.present?
              work_schedule.update(
                start_time: a[:start_time] ? Time.zone.parse(a[:start_time], Time.current) : '',
                end_time: a[:end_time] ? Time.zone.parse(a[:end_time], Time.current) : '',
              )
            else
              user.work_schedules.build(
                date: a[:date] ? Time.zone.parse(a[:date], Time.current) : '',
                start_time: a[:start_time] ? Time.zone.parse(a[:start_time], Time.current) : '',
                end_time: a[:end_time] ? Time.zone.parse(a[:end_time], Time.current) : '',
              )
            end
          end
        end
      end

      user.default_facility_id = if args[:default_facility_id]
                                   args[:default_facility_id].to_bson_id
                                 end
      user.roles = if args[:roles]
                     args[:roles].map(&:to_bson_id)
                   else
                     []
                   end
      user.facilities = if args[:facilities]
                          args[:facilities].map(&:to_bson_id)
                        else
                          []
                        end
      user.timezone = get_timezone(user, @current_user)
    else
      if args[:default_facility_id].present?
        args[:default_facility_id] = args[:default_facility_id].to_bson_id
      end
      if args[:facilities].present?
        args[:facilities] = args[:facilities].map(&:to_bson_id)
      end
      if args[:roles].present?
        args[:roles] = args[:roles].map(&:to_bson_id)
      end
      user = User.new(args)
    end
    user.save!
    user
  end

  private

  def get_timezone(user, current_user)
    timezone = Facility.find(user.default_facility_id)&.timezone if user.default_facility_id.present?
    timezone ||= Facility.find(user.facilities.first)&.timezone if user.facilities.any?
    timezone ||= current_user.timezone
    timezone
  end
end
