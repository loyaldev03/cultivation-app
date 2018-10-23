class Api::V1::DailyTasksController < Api::V1::BaseApiController
  before_action :set_task
  before_action :set_work_day

  def start_task
    @work_day.start!

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def stop_task
    @work_day.stop!

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def add_notes
    @work_day.notes.create(notes: params[:notes])

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  private

  def set_task
    @task = current_user.cultivation_tasks.find(params[:id])
  end

  def set_work_day
    @work_day = @task.work_days.find_or_initialize_by(date: params[:date], user: current_user)
  end
end
