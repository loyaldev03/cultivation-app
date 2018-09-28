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

  def update_group
  end
end
