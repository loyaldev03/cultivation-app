class Api::V1::DashboardChartsController < Api::V1::BaseApiController
  def batch_test_result
    # NOTE : should be re write the code for test_results not facility_strain
    result = Charts::QueryBatchTestResult.call(current_user, {order: params[:order]}).result
    render json: result.to_json, status: 200
  end

  def strain_distribution
    result = Charts::QueryStrainDistribution.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def worker_capacity
    result = Charts::QueryWorkerCapacity.call(current_user, {batch_id: params[:batch_id]}).result
    render json: result.to_json, status: 200
  end

  def batch_distribution
    facility_ids = params[:facility_id]&.split(",") || []
    result = Charts::QueryBatchDistribution.call(current_user,
      {
        range: params[:range],
        facility_ids: facility_ids
      }
    ).result
    render json: result.to_json, status: 200
  end

  def cost_breakdown
    result = Charts::CalculateCostBreakdown.call(current_user, {month: params[:month], year: params[:year]}).result
    render json: result.to_json, status: 200
  end

  def unassigned_task
    result = Charts::UnassignedTask.call(current_user, {facility_id: params[:facility_id], limit: params[:limit]}).result
    render json: result.to_json, status: 200
  end

  def highest_cost_task
    result = Charts::HighestCostTask.call(current_user, {range: params[:range], facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def issue_list
    result = Charts::IssueList.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def tasklist_by_day
    date = Time.parse(params[:date])
    tasks = Cultivation::QueryTasksByDate.call(
      facility_ids: current_user_facilities_ids,
      date: date,
    ).result
    batches_ids = tasks.any? ? tasks.map(&:batch_id).uniq : []
    batches = Cultivation::Batch.find(batches_ids)
    # query_locations = batches.map { |a| {batch_id: a.id.to_s,
    # query: QueryLocations.call(a.facility_id)} }
    json_serializer = TaskCalendarSerializer.new(
      tasks,
      params: {batches: batches},
    ).serializable_hash[:data]

    render json: json_serializer
  end

  def tasks_by_date_range
    result = DailyTask::QueryTaskByDateRange.call(params[:start_date], params[:end_date]).result
    render json: result
  end

  def performer_list
    result = Charts::QueryPerformerList.call(current_user, {order: params[:order], order_type: params[:order_type]}).result
    render json: result.to_json, status: 200
  end

  def cultivation_info
    facility_ids = params[:facility_id]&.split(',') || current_user_facilities_ids
    result = Charts::QueryCultivationInfo.call(
      current_user,
      facility_ids: facility_ids,
      period: params[:period],
    ).result
    render json: result.to_json, status: 200
  end

  def batches_info
    result = Charts::QueryBatchesInfo.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def plant_distribution_room
    result = Charts::QueryPlantDistributionByRoom.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def harvest_cost
    result = Charts::QueryHarvestCost.call(current_user, {facility_id: params[:facility_id], order: params[:order]}).result
    render json: result.to_json, status: 200
  end

  def harvest_yield
    result = Charts::QueryHarvestYield.call(current_user, {facility_id: params[:facility_id], order: params[:order]}).result
    render json: result.to_json, status: 200
  end

  def tasks_dashboard
    result = Charts::QueryTaskDashboard.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def issue_by_priority
    result = Charts::QueryIssueByPriority.call(current_user, {facility_id: params[:facility_id], order: params[:order]}).result
    render json: result.to_json, status: 200
  end

  def issue_by_group
    result = Charts::QueryIssueByGroup.call(current_user, {facility_id: params[:facility_id], order: params[:order]}).result
    render json: result.to_json, status: 200
  end
end
