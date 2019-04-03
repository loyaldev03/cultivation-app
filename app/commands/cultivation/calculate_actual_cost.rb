
module Cultivation
  class CalculateActualCost
    prepend SimpleCommand

    attr_reader :args

    def initialize(time_log_id)
      @time_log = Cultivation::TimeLog.find(time_log_id)
      @user = @time_log.user
    end

    def call
      #assume time format is 24
      working_hour_start = DateTime.new(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 8, 00)
      working_hour_end = DateTime.new(@time_log.start_time.year, @time_log.start_time.month, @time_log.start_time.day, 18, 00)
      # 8am -> 6pm
      # CASES
      # 7.30am - 8.30 am => exceed start working hour (done)
      # 9am - 5pm => in the range (done)
      # 5.30pm -6.30pm => exceed end working hour
      # 7.30am - 6.30pm => exceed start and end working hour

      if ((@time_log.start_time >= working_hour_start) and (@time_log.start_time < working_hour_end)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #compare hours in the range
        pp 1
        actual_cost = @time_log.duration_in_minutes * (@user.hourly_rate / 60)
        actual_minutes = @time_log.duration_in_minutes
      elsif ((@time_log.start_time < working_hour_start)) and ((@time_log.end_time > working_hour_start) and (@time_log.end_time <= working_hour_end)) #7.30am-9.30am
        pp 2
        ot_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 8am - 7.30 am = 30minutes
        in_range_minutes = difference_in_minutes(@time_log.end_time, working_hour_start) # 9.30am - 8am = 30minutes + 60minutes
        actual_cost = (in_range_minutes * (@user.hourly_rate / 60)) + (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = in_range_minutes + ot_minutes
      elsif ((@time_log.start_time >= working_hour_start) and (@time_log.start_time <= working_hour_end)) and (@time_log.end_time > working_hour_end) #8.00am-6.30pm
        pp 3
        ot_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        in_range_minutes = difference_in_minutes(working_hour_end, @time_log.start_time) # 8.00am - 6pm = 10 hours
        actual_cost = (in_range_minutes * (@user.hourly_rate / 60)) + (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = in_range_minutes + ot_minutes
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time > working_hour_end) #8.00am-6.30pm
        pp 4
        ot1_minutes = difference_in_minutes(working_hour_start, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        ot2_minutes = difference_in_minutes(@time_log.end_time, working_hour_end) # 6pm - 6.30 pm = 30minutes
        total_ot = ot1_minutes + ot2_minutes
        in_range_minutes = difference_in_minutes(working_hour_end, working_hour_start) # 8.00am - 6pm = 10 hours
        actual_cost = (in_range_minutes * (@user.hourly_rate / 60)) + (total_ot * (@user.overtime_hourly_rate / 60))
        actual_minutes = in_range_minutes + total_ot
      elsif (@time_log.start_time > working_hour_start) and (@time_log.end_time > working_hour_end) #8.00am-6.30pm
        pp 5
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = ot_minutes
      elsif (@time_log.start_time < working_hour_start) and (@time_log.end_time < working_hour_end) #8.00am-6.30pm
        pp 6
        ot_minutes = difference_in_minutes(@time_log.end_time, @time_log.start_time) # 7.30am - 8.00 am = 30minutes
        actual_cost = (ot_minutes * (@user.overtime_hourly_rate / 60))
        actual_minutes = ot_minutes
      end

      return {actual_cost: actual_cost, actual_minutes: actual_minutes}
    end

    def difference_in_minutes(start_time, end_time) # 1 hour 30 minute should return 90 minutes
      (start_time.to_f - end_time.to_f) / 1.minutes
    end
  end
end
