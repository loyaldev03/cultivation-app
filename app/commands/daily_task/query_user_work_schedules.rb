module DailyTask
  class QueryUserWorkSchedules
    prepend SimpleCommand

    attr_reader :current_user, :task_id, :note_id

    def initialize(start_date, end_date, current_user)
      @current_user = current_user
      @start_date = Date.parse(start_date)
      @end_date = Date.parse(end_date)
    end

    def call
      dates = (@start_date..@end_date).to_a
      user_work_schedules = @current_user.work_schedules
      work_schedules = []
      dates.each do |date|
        day = date.strftime('%A') #convert to day
        current_work_schedule = user_work_schedules.detect { |a| a[:day] == day.downcase }
        if current_work_schedule.start_time.present? and current_work_schedule.end_time.present? # if workschedule exist for the day
          result = {
            date: date,
            start_time: current_work_schedule.start_time.strftime('%R'),
            end_time: current_work_schedule.end_time.strftime('%R'),
          }
          work_schedules << result
        end
      end
      return work_schedules
    end
  end
end
