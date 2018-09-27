class Api::V1::UserRolesController < Api::V1::BaseApiController
  def search
    result = OpenStruct.new({
      id: BSON::ObjectId.new,
      groups: Common::Group.all,
      roles: Common::Role.all,
      users: User.all,
    })
    data = Common::FacilityUserRoleSerializer.new(result).serialized_json
    sleep 3
    render json: data
  end

  def update_group
  end
end
