
module Cultivation
  class CalculateTaskActualCostAndHours
    prepend SimpleCommand

    attr_reader :args, :breakdown

    def initialize(time_log, user, breakdown = false)
      @time_log = time_log
      @user = user
      @breakdown = breakdown
    end

    def call
      # Time log is recorded at
      #   - time recorded is assume at facility timezone

      # Work scheedule
      #   - work schedule is date & time store at UTC.
      #   - to use work schedule, extract the date to individual components and localise to facility'es timezone.
      #   - ignore the timezone stored in the workscuedle.
      #

      # Inferring the rates
      #   1. Get timezone
      tz = @time_log.task.facility.timezone

      #   2. Assuming time log is already recording at the
      st = @time_log.start_time
      et = @time_log.end_time

      # Force convert work schedule start & end time to facility's timezone
      start_time = Time.find_zone(tz).local(st.year, st.month, st.day, st.hour, st.min)
      end_time = Time.find_zone(tz).local(et.year, et.month, et.day, et.hour, et.min)

      #   3. Get the work schedule
      work_date = Time.find_zone(tz).local(
        start_time.year,
        start_time.month,
        start_time.day
      )
      ws = @user.work_schedules.find_by(date: work_date)
      return if ws.nil?

      working_hour_start = Time.find_zone(tz).local(ws.date.year, ws.date.month, ws.date.day, ws.start_time.hour, ws.start_time.min)
      working_hour_end = Time.find_zone(tz).local(ws.date.year, ws.date.month, ws.date.day, ws.end_time.hour, ws.end_time.min)
      user_overtime_hourly_rate = @user.overtime_hourly_rate || 0
      user_hourly_rate = @user.hourly_rate || 0

      #assume time format is 24
      # working_hour_start = Time.zone.local(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 8, 00)
      # working_hour_end = Time.zone.local(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 18, 00)

      # user_overtime_hourly_rate = @user.overtime_hourly_rate || 0
      # user_hourly_rate = @user.hourly_rate || 0

      # 8am -> 6pm
      # CASES
      # 7.30am - 8.30 am => exceed start working hour (done)
      # 9am - 5pm => in the range (done)
      # 5.30pm -6.30pm => exceed end working hour
      # 7.30am - 6.30pm => exceed start and end working hour

      # (start_time in working hour range) and (end_time in working hour range)
      # For now, we are not converting time log to facility timezone. This is for scenerio when the facility changes
      # to another timezone
      #
      if ((@time_log.start_time >= working_hour_start) and (@time_log.start_time < working_hour_end)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #compare hours in the range
        actual_cost = @time_log.duration_in_minutes * (user_hourly_rate / 60)
        actual_minutes = @time_log.duration_in_minutes
        if breakdown
          @time_log.breakdowns.new(cost_type: 'Normal', rate: user_hourly_rate, duration: actual_minutes, cost: actual_cost)
          @time_log.save
        end
        # (start_time earlier than working hour start time) and (end_time in working hour range)
      elsif ((@time_log.start_time < working_hour_start)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #7.30am-9.30am
        #calculate ot minutes
        #calculate diff working_hour_start to start lunch hour
        ot_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 8am - 7.30 am = 30minutes
        ot_cost = (ot_minutes * (user_overtime_hourly_rate / 60))

        in_range_minutes = difference_in_minutes(@time_log.end_time, working_hour_start) # 9.30am - 8am = 30minutes + 60minutes
        in_range_cost = (in_range_minutes * (user_hourly_rate / 60))

        if breakdown
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: ot_minutes, cost: ot_cost)
          @time_log.breakdowns.new(cost_type: 'Normal', rate: user_hourly_rate, duration: in_range_minutes, cost: in_range_cost)
          @time_log.save
        end

        actual_cost = in_range_cost + ot_cost
        actual_minutes = in_range_minutes + ot_minutes
        # (start_time in working hour range) and (end_time exceed working hour end time)
      elsif ((@time_log.start_time >= working_hour_start) and (@time_log.start_time <= working_hour_end)) and (@time_log.end_time > working_hour_end) #8.00am-6.30pm
        ot_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        ot_cost = ot_minutes * (user_overtime_hourly_rate / 60)

        in_range_minutes = difference_in_minutes(working_hour_end, @time_log.start_time) # 8.00am - 6pm = 10 hours
        in_range_cost = in_range_minutes * (user_hourly_rate / 60)

        if breakdown
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: ot_minutes, cost: ot_cost)
          @time_log.breakdowns.new(cost_type: 'Normal', rate: user_hourly_rate, duration: in_range_minutes, cost: in_range_cost)
          @time_log.save
        end

        actual_cost = in_range_cost + ot_cost
        actual_minutes = in_range_minutes + ot_minutes
        # start_time earlier than working hour start time and end_time exceed working hour end time
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time > working_hour_end)
        ot1_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        ot1_cost = ot1_minutes * (user_overtime_hourly_rate / 60)

        ot2_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        ot2_cost = ot2_minutes * (user_overtime_hourly_rate / 60)

        total_ot_cost = ot1_cost + ot2_cost
        total_ot_minutes = ot1_minutes + ot2_minutes

        in_range_minutes = difference_in_minutes(working_hour_end, working_hour_start) # 8.00am - 6pm = 10 hours
        in_range_cost = in_range_minutes * (user_hourly_rate / 60)

        if breakdown
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: ot1_minutes, cost: ot1_cost)
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: ot2_minutes, cost: ot2_cost)
          @time_log.breakdowns.new(cost_type: 'Normal', rate: user_hourly_rate, duration: in_range_minutes, cost: in_range_cost)
          @time_log.save
        end

        actual_cost = in_range_cost + total_ot_cost
        actual_minutes = in_range_minutes + total_ot_minutes
        # full OT start_time exceed working hour end_time and end_time exceed working hour end_time
      elsif (@time_log.start_time > working_hour_end) and (@time_log.end_time > working_hour_end) #7pm - 8pm
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (user_overtime_hourly_rate / 60))
        actual_minutes = ot_minutes
        if breakdown
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: actual_minutes, cost: actual_cost)
          @time_log.save
        end
        # full OT start time earlier working hour start_time and end time earlier working hour start_time
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time < working_hour_start) #6am - 7am
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (user_overtime_hourly_rate / 60))
        actual_minutes = ot_minutes

        if breakdown
          @time_log.breakdowns.new(cost_type: 'OT', rate: user_overtime_hourly_rate, duration: actual_minutes, cost: actual_cost)
          @time_log.save
        end
      end

      return {actual_cost: actual_cost, actual_minutes: actual_minutes}
    end

    def difference_in_minutes(start_time, end_time) # 1 hour 30 minute should return 90 minutes
      (start_time.to_f - end_time.to_f) / 1.minutes
    end

    class << self
      def call_by_id(time_log_id, user, breakdown = false)
        time_log = Cultivation::TimeLog.find(time_log_id.to_bson_id)
        Cultivation::CalculateTaskActualCostAndHours.call(time_log, user, breakdown)
      end
    end
  end
end
