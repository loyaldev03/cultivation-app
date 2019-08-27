class Api::V1::PeopleController < Api::V1::BaseApiController
  def head_counts_chart
    result = People::QueryHeadcount.call(current_user, {facility_id: params[:facility_id], period: params[:period]}).result
    render json: result.to_json, status: 200
  end

  def employee_salary_chart
    result = People::QueryEmployeeSalary.call(current_user, {facility_id: params[:facility_id], period: params[:period]}).result
    render json: result.to_json, status: 200
  end

  def reminder
    result = People::Reminder.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def worker_attrition
    result = People::QueryWorkerAttrition.call(current_user, {facility_id: params[:facility_id], period: params[:period], role: params[:role]}).result
    render json: result.to_json, status: 200
  end

  def get_roles
    result = Common::Role.all.map do |data|
      {
        role_id: data.id.to_s,
        role_name: data.name,
      }
    end
    render json: result.to_json, status: 200
  end

  def capacity_planning
    result = People::CapacityPlanning.call(current_user, {facility_id: params[:facility_id], period: params[:period]}).result
    render json: result.to_json, status: 200
  end

  def overall_info
    result = People::QueryOverallInfo.call(current_user, {facility_id: params[:facility_id], period: params[:period]}).result
    render json: result.to_json, status: 200
  end

  def arrival_on_time
    result = People::ArrivalOnTime.call(current_user, {facility_id: params[:facility_id], order: params[:order], role: params[:role]}).result
    render json: result.to_json, status: 200
  end

  def completing_task_ontime
    result = People::CompletingTask.call(current_user, {facility_id: params[:facility_id], order: params[:order], role: params[:role]}).result
    render json: result.to_json, status: 200
  end

  def worker_by_skills
    result = People::QueryUserBySkill.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def job_roles
    result = People::QueryJobRole.call(current_user, {facility_id: params[:facility_id], period: params[:period]}).result
    render json: result.to_json, status: 200
  end

  def employee_list
    result = People::QueryEmployee.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def timesheet_approval
    result = People::QueryTimesheetApproval.call(current_user, {facility_id: params[:facility_id], role: params[:role], status: params[:status], range: params[:range]}).result
    render json: result.to_json, status: 200
  end

  def timesheet_update_status
    date = Date.current
    date_find = Date.commercial(date.year, params[:week].to_i, 1)
    user = User.find(params[:user_id])
    work_schedules = user.work_schedules.where(start_time: date_find.beginning_of_week..date_find.end_of_week)
    work_schedules.each do |x|
      u = x.update(timesheet_status: params[:status])
    end
  end
end
