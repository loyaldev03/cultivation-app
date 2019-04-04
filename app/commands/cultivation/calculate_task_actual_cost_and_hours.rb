
module Cultivation
  class CalculateTaskActualCostAndHours
    prepend SimpleCommand

    attr_reader :args

    def initialize(time_log_id)
      @time_log = Cultivation::TimeLog.find(time_log_id)
      @user = @time_log.user
    end

    def call
      #assume time format is 24
      working_hour_start = Time.zone.local(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 8, 00)
      working_hour_end = Time.zone.local(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 18, 00)

      # 8am -> 6pm
      # CASES
      # 7.30am - 8.30 am => exceed start working hour (done)
      # 9am - 5pm => in the range (done)
      # 5.30pm -6.30pm => exceed end working hour
      # 7.30am - 6.30pm => exceed start and end working hour

      # (start_time in working hour range) and (end_time in working hour range)
      if ((@time_log.start_time >= working_hour_start) and (@time_log.start_time < working_hour_end)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #compare hours in the range
        pp 1
        actual_cost = @time_log.duration_in_minutes * (@user.hourly_rate / 60)
        actual_minutes = @time_log.duration_in_minutes
        @time_log.breakdowns.new(cost_type: 'Normal', rate: @user.hourly_rate, duration: actual_minutes, cost: actual_cost)
        @time_log.save
        # (start_time earlier than working hour start time) and (end_time in working hour range)
      elsif ((@time_log.start_time < working_hour_start)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #7.30am-9.30am
        pp 2
        #calculate ot minutes
        #calculate diff working_hour_start to start lunch hour
        ot_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 8am - 7.30 am = 30minutes
        ot_cost = (ot_minutes * (@user.overtime_hourly_rate / 60))
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: ot_minutes, cost: ot_cost)

        in_range_minutes = difference_in_minutes(@time_log.end_time, working_hour_start) # 9.30am - 8am = 30minutes + 60minutes
        in_range_cost = (in_range_minutes * (@user.hourly_rate / 60))
        @time_log.breakdowns.new(cost_type: 'Normal', rate: @user.hourly_rate, duration: in_range_minutes, cost: in_range_cost)
        @time_log.save

        actual_cost = in_range_cost + ot_cost
        actual_minutes = in_range_minutes + ot_minutes
        # (start_time in working hour range) and (end_time exceed working hour end time)
      elsif ((@time_log.start_time >= working_hour_start) and (@time_log.start_time <= working_hour_end)) and (@time_log.end_time > working_hour_end) #8.00am-6.30pm
        pp 3

        ot_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        ot_cost = ot_minutes * (@user.overtime_hourly_rate / 60)
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: ot_minutes, cost: ot_cost)

        in_range_minutes = difference_in_minutes(working_hour_end, @time_log.start_time) # 8.00am - 6pm = 10 hours
        in_range_cost = in_range_minutes * (@user.hourly_rate / 60)
        @time_log.breakdowns.new(cost_type: 'Normal', rate: @user.hourly_rate, duration: in_range_minutes, cost: in_range_cost)
        @time_log.save

        actual_cost = in_range_cost + ot_cost
        actual_minutes = in_range_minutes + ot_minutes
        # start_time earlier than working hour start time and end_time exceed working hour end time
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time > working_hour_end)
        pp 4
        ot1_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        ot1_cost = ot1_minutes * (@user.overtime_hourly_rate / 60)
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: ot1_minutes, cost: ot1_cost)

        ot2_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        ot2_cost = ot2_minutes * (@user.overtime_hourly_rate / 60)
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: ot2_minutes, cost: ot2_cost)

        total_ot_cost = ot1_cost + ot2_cost
        total_ot_minutes = ot1_minutes + ot2_minutes

        in_range_minutes = difference_in_minutes(working_hour_end, working_hour_start) # 8.00am - 6pm = 10 hours
        in_range_cost = in_range_minutes * (@user.hourly_rate / 60)
        @time_log.breakdowns.new(cost_type: 'Normal', rate: @user.hourly_rate, duration: in_range_minutes, cost: in_range_cost)
        @time_log.save

        actual_cost = in_range_cost + total_ot_cost
        actual_minutes = in_range_minutes + total_ot_minutes
        # full OT start_time exceed working hour end_time and end_time exceed working hour end_time
      elsif (@time_log.start_time > working_hour_end) and (@time_log.end_time > working_hour_end) #7pm - 8pm
        pp 5
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = ot_minutes
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: actual_minutes, cost: actual_cost)
        @time_log.save
        # full OT start time earlier working hour start_time and end time earlier working hour start_time
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time < working_hour_start) #6am - 7am
        pp 6
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = ot_minutes
        @time_log.breakdowns.new(cost_type: 'OT', rate: @user.overtime_hourly_rate, duration: actual_minutes, cost: actual_cost)
        @time_log.save
      end

      return {actual_cost: actual_cost, actual_minutes: actual_minutes}
    end

    def difference_in_minutes(start_time, end_time) # 1 hour 30 minute should return 90 minutes
      (start_time.to_f - end_time.to_f) / 1.minutes
    end
  end
end
