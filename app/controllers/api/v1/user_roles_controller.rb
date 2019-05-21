class Api::V1::UserRolesController < Api::V1::BaseApiController
  def search
    include_inactive_user = params[:include_inactive_user] === '1'
    if include_inactive_user
      users = User.all.order(is_active: :desc, first_name: :asc, last_name: :asc)
    else
      users = User.where(is_active: true).order(first_name: :asc, last_name: :asc)
    end

    result = OpenStruct.new({
      id: BSON::ObjectId.new,
      facilities: Facility.all.pluck_to_hash([:id, :code, :name]),
      roles: Common::QueryRoles.call.result.order(name: :asc),
      users: users,
      modules: Constants::APP_MODULES,
      company_work_schedules: CompanyInfo.first.work_schedules,
    })
    data = Common::FacilityUserRoleSerializer.new(result).serialized_json
    render json: data
  end

  def update_user
    save_user_cmd = SaveUser.call(user_params, current_user)
    if save_user_cmd.success?
      render json: Common::FacilityUserSerializer.new(save_user_cmd.result).serialized_json
    else
      render json: {error: 'Error saving user details'}
    end
  end

  def update_role
    # Rails.logger.debug "\033[31m #{role_params} \033[0m"
    save_role_cmd = SaveRole.call(role_params, current_user)
    if save_role_cmd.success?
      render json: Common::FacilityRoleSerializer.new(save_role_cmd.result).serialized_json
    else
      render json: {error: 'Error saving user details'}
    end
  end

  def destroy_role
    destroy_cmd = DestroyRole.call(role_params[:id])
    if destroy_cmd.success?
      render json: {data: 'Ok'}
    else
      render json: {error: 'Error saving user details'}
    end
  end

  def schedules_by_date
    user = User.find(params[:user_id])
    date = Time.zone.parse(params[:date], Time.current)
    work_schedules = user.work_schedules.select { |a| a[:date] }
    schedule = []
    (0..6).each do |i|
      current_date = date + i.days
      current_schedule = work_schedules.detect { |a| a[:date].beginning_of_day == current_date.beginning_of_day }
      schedule << {
        day_id: i,
        day: Date::DAYNAMES[current_date.wday].downcase,
        date: current_date&.strftime('%D'),
        start_time: current_schedule&.start_time&.strftime('%H:%M') || '',
        end_time: current_schedule&.end_time&.strftime('%H:%M') || '',
      }
    end
    render json: {data: schedule}
  end

  def copy_schedule_week
    user = User.find(params[:user_id])
    args = {from: params[:from], to: params[:to]}
    cmd = Common::CopyScheduleWeek.call(user, args)

    if cmd.success?
      render json: {data: 'Data copied'}
    else
      render json: {error: 'Error copying schedule'}
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :id,
      :email,
      :password,
      :first_name,
      :last_name,
      :title,
      :photo_data,
      :is_active,
      :exempt,
      :default_facility_id,
      :timezone,
      :hourly_rate,
      :overtime_hourly_rate,
      :user_mode,
      :reporting_manager_id,
      facilities: [],
      roles: [],
      work_schedules: [:day, :start_time, :end_time],
      non_exempt_schedules: [:start_date, :end_date, :start_time, :end_time, :day_id, :day, :date, :display_date],
    )
  end

  def role_params
    params.require(:role).permit(
      :id,
      :name,
      :desc,
      permissions: [
        :code,
        :value,
      ],
    )
  end
end
