class Api::V1::DashboardChartsController < Api::V1::BaseApiController
  def batch_test_result
    # NOTE : should be re write the code for test_results not facility_strain
    result = Charts::QueryBatchTestResult.call(current_user, {order: params[:order]}).result
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
    result = Charts::QueryBatchDistribution.call(current_user, {date: params[:date], label: params[:label]}).result
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

  def issue_list
    result = Charts::IssueList.call(current_user).result
    render json: result.to_json, status: 200
  end

  def tasklist_by_day
    tasks = Cultivation::Task.expected_on(params[:date])
    batches = Cultivation::Batch.find(tasks.map { |a| a.batch_id }.uniq)
    query_locations = batches.map { |a| {batch_id: a.id.to_s, query: QueryLocations.call(a.facility_id)} }
    json_serializer = TaskCalendarSerializer.new(
      tasks,
      params: {query: query_locations},
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
end
