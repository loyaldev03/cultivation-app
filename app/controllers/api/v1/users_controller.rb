class Api::V1::UsersController < Api::V1::BaseApiController
  def index
    users = User.all
    options = {}
    options[:is_collection]
    user_json = UserSerializer.new(users, options).serialized_json
    render json: user_json
  end

  def roles
    roles = Common::Role.all.order(name: :asc)
    options = {}
    options[:is_collection]
    roles_json = RolesSerializer.new(roles, options).serialized_json
    render json: roles_json
  end
end
