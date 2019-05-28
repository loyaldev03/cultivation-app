class Mobile::Worker::DashboardsController < ApplicationController
  layout 'worker_login'

  def index
    #put 2.hours and 5 minutes to be configurable
    @break_hours = 2.minutes # 2.hours
    @break_minutes = 1.minutes # 15.minutes

    @work_log_available = current_user.work_logs.last && current_user.work_logs.last.end_time.nil? # true if the clock started but havent stop
    @next_break = current_user.work_logs.last.start_time + @break_hours || nil if @work_log_available
    @break_available = Time.now >= @next_break if @next_break
    if current_user.work_log_status == 'pause'
      @break_duration = (((current_user.work_logs.last.end_time + @break_minutes) - Time.now) / 1.minutes).round(2) # find changes in minutes to display orange bar
      @time_to_resume = @break_duration <= 0
    end
  end
end
