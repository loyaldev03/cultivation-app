class Api::V1::UsersController < Api::V1::BaseApiController
  def index
    users = User.where(is_active: true)
    user_json = UserSerializer.new(users).serialized_json
    render json: user_json
  end

  def roles
    roles = Common::Role.all.order(name: :asc)
    roles_json = RolesSerializer.new(roles).serialized_json
    render json: roles_json
  end
end
