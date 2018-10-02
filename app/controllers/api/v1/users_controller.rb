class Api::V1::UsersController < Api::V1::BaseApiController
  def index
    users = User.all
    options = {}
    options[:is_collection]
    user_json = UserSerializer.new(users, options).serialized_json
    render json: user_json
  end
end
