class Api::V1::UserRolesController < Api::V1::BaseApiController
  def search
    include_inactive_user = params[:include_inactive_user] === '1'
    Rails.logger.debug "\033[31m include_inactive_user: #{include_inactive_user} \033[0m"
    if include_inactive_user
      users = User.all.order(is_active: :desc, first_name: :asc, last_name: :asc)
    else
      users = User.where(is_active: true).order(first_name: :asc, last_name: :asc)
    end
    result = OpenStruct.new({
      id: BSON::ObjectId.new,
      facilities: Facility.all.pluck_to_hash([:id, :code, :name]),
      roles: Common::Role.all.order(name: :asc),
      users: users,
    })
    data = Common::FacilityUserRoleSerializer.new(result).serialized_json
    render json: data
  end

  def update_user
    # Rails.logger.debug "\033[31m #{user_params} \033[0m"
    save_user_cmd = SaveUser.call(user_params)
    if save_user_cmd.success?
      render json: Common::FacilityUserSerializer.new(save_user_cmd.result).serialized_json
    else
      render json: {error: 'Error saving user details'}
    end
  end

  def update_role_permission
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
      :default_facility_id,
      facilities: [],
      roles: [],
    )
  end
end
