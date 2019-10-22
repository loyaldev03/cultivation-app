class Api::V1::WorkerDashboardController < Api::V1::BaseApiController
  def working_hours_chart
    result = Charts::QueryWorkerWorkingHour.call(current_user, {range: params[:range]}).result

    render json: result
  end

  def overall_info
    work_hours = Charts::QueryTotalWorkHour.call(current_user, {range: params[:range]}).result
    tasks_done = Charts::QueryWorkerTasksDone.call(current_user, {range: params[:range]}).result
    on_time_arrivals = Charts::QueryWorkerOntimeArrival.call(current_user, {range: params[:range]}).result
    completed_task_on_time = Charts::QueryWorkerTaskOntime.call(current_user, {range: params[:range]}).result

    data = {
      work_hours: work_hours,
      tasks_done: tasks_done,
      on_time_arrivals: on_time_arrivals,
      completed_task_on_time: completed_task_on_time,
    }
    render json: data
  end
end
