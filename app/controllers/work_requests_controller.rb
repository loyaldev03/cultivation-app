class WorkRequestsController < ApplicationController
  def requests
    @work_applications = current_user.work_applications.includes(:user)
    @work_applications = @work_applications.map do |a|
      {
        id: a.id,
        display_name: a.user.display_name,
        user_id: a.user.id.to_s,
        roles: a.user.display_roles.to_sentence,
        photo_url: a.user.photo_url,
        request_type: a.request_type,
        date: get_date_worker(a),
        status: a.status,
      }
    end
  end

  def update_requests
    @work_application = current_user.work_applications.find(params[:work_request_id])
    if params[:type] == 'rejected'
      @work_application.update(status: 'rejected')
    elsif params[:type] == 'approved'
      @work_application.update(status: 'approved')
    end
    redirect_to requests_path
  end

  def worker_schedule
    @worker = User.find(params[:worker_id])
    @worker_schedule = @worker.work_schedules
    @worker_schedule = @worker_schedule.map do |a|
      {
        day: a.day,
        start_time: a.start_time&.strftime('%R') || '00:00',
        end_time: a.end_time&.strftime('%R') || '00:00',
      }
    end
  end

  private

  def get_date_worker(work_request)
    if work_request.request_type == 'OT'
      return "#{work_request.start_time.strftime('%D %R')} - #{work_request.end_time.strftime('%D %R')}"
    else
      return "#{work_request.start_time.strftime('%D')} - #{work_request.end_time.strftime('%D')}"
    end
  end
end
