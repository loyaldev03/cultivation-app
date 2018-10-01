class Api::V1::UserRolesController < Api::V1::BaseApiController
  def search
    result = OpenStruct.new({
      id: BSON::ObjectId.new,
      facilities: Facility.all.pluck_to_hash([:id, :code, :name]),
      groups: Common::Group.all.order(name: :asc),
      roles: Common::Role.all.order(name: :asc),
      users: User.all.order(first_name: :asc),
    })
    data = Common::FacilityUserRoleSerializer.new(result).serialized_json
    render json: data
  end

  def update_user
    # Rails.logger.debug ">>> #{user_params}"
    # # TODO: update
    # # - first name, last name
    # # - roles, facilities
    # # - is_active
    # if true
    #   render json: {data: "user"}
    # else
    #   render json: {error: "Error saving user details"}
    # end
    render json: {data: 'Ok'}
  end

  def update_role_permission
  end

  private

  def user_params
    params.require(:user).permit(
      :id,
      :first_name,
      :last_name,
    )
  end
end
