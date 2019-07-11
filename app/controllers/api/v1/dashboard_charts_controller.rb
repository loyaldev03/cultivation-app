class Api::V1::DashboardChartsController < Api::V1::BaseApiController
  def batch_test_result
    # NOTE : should be re write the code for test_results not facility_strain
    result = Charts::QueryBatchTestResult.call(current_user, {}).result
    render json: result.to_json, status: 200
  end

  def strain_distribution
    result = Charts::QueryStrainDistribution.call(current_user, {}).result
    render json: result.to_json, status: 200
  end

  def worker_capacity
    result = Charts::QueryWorkerCapacity.call(current_user, {batch_id: params[:batch_id]}).result
    render json: result.to_json, status: 200
  end

  def batch_distribution
    result = Charts::QueryBatchDistribution.call(current_user, {}).result
    render json: result.to_json, status: 200
  end

  def cost_breakdown
    result = Charts::CalculateCostBreakdown.call(current_user, {month: params[:month]}).result
    render json: result.to_json, status: 200
  end

  def unassigned_task
    result = Charts::UnassignedTask.call(current_user).result
    render json: result.to_json, status: 200
  end
end
