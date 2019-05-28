class Mobile::Worker::WorkLogsController < ApplicationController
  layout 'worker_login'

  def clock_in
    @break_hours = 2.minutes # 2.hours
    current_time = Time.now
    current_user.update(work_log_status: 'started')
    params = {message: " It's time to take a break! ", user_ids: [current_user.id.to_s], time_of_day: current_time + @break_hours}
    cmd = Common::SendOnesignalNotification.call(current_user, params)
    work_log = current_user.work_logs.create(start_time: current_time, one_signal_id: cmd.result['id'])
    redirect_to mobile_worker_dashboards_path
  end

  def clock_out # sign out for the day
    work_log = current_user.work_logs.last
    work_log.update(end_time: Time.now)
    cmd = Common::RemoveOnesignalNotification.call(current_user, {one_signal_id: work_log.one_signal_id}) if work_log.one_signal_id
    current_user.update(work_log_status: 'stopped')
    sign_out(@user)
    redirect_to mobile_worker_logins_path
  end

  def pause # take a break every two hours
    current_time = Time.now
    work_log = current_user.work_logs.last.update(end_time: current_time)
    current_user.update(work_log_status: 'pause')
    @break_minutes = 1.minutes # 15.minutes
    params = {message: 'Break time over!', user_ids: [current_user.id.to_s], time_of_day: current_time + @break_minutes}
    cmd = Common::SendOnesignalNotification.call(current_user, params)
    redirect_to mobile_worker_dashboards_path
  end

  def resume # resume after 15 minutes break
    work_log = current_user.work_logs.create(start_time: Time.now)
    current_user.update(work_log_status: 'started')
    redirect_to mobile_worker_dashboards_path
  end
end
