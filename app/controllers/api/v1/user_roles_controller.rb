class Api::V1::UserRolesController < Api::V1::BaseApiController
  def search
    result = OpenStruct.new({
      id: BSON::ObjectId.new,
      facilities: Facility.all.pluck_to_hash([:id, :code, :name]),
      roles: Common::Role.all.order(name: :asc),
      users: User.all.order(is_active: :desc, first_name: :asc),
      modules: Constants::APP_MODULES,
    })
    data = Common::FacilityUserRoleSerializer.new(result).serialized_json
    render json: data
  end

  def update_user
    Rails.logger.debug "\033[31m #{user_params} \033[0m"
    save_user_cmd = SaveUser.call(user_params)
    if save_user_cmd.success?
      render json: Common::FacilityUserSerializer.new(save_user_cmd.result).serialized_json
    else
      render json: {error: 'Error saving user details'}
    end
  end

  def update_role
    Rails.logger.debug "\033[31m #{role_params} \033[0m"
    save_role_cmd = SaveRole.call(role_params)
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
