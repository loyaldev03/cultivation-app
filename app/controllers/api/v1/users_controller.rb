class Api::V1::UsersController < Api::V1::BaseApiController
  def index
    cmd = QueryUsers.call(current_user)
    if cmd.success?
      render json: UserSerializer.new(cmd.result).serialized_json
    else
      render json: command.errors, status: 422
    end
  end

  def roles
    roles = Common::Role.all.order(name: :asc)
    roles_json = RolesSerializer.new(roles).serialized_json
    render json: roles_json
  end
end
