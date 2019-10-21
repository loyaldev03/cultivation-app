class Api::V1::WorkerDashboardController < Api::V1::BaseApiController
  def working_hours_chart
    result = Charts::QueryWorkerWorkingHour.call(current_user, {range: params[:range]}).result

    render json: result
  end
end
