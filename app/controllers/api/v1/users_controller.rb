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

  def by_facility
    facility_id = BSON::ObjectId(params[:facility_id])
    filter = params[:filter] || ''
    users = User.in(facilities: facility_id).any_of({last_name: /^#{filter}/i}, {first_name: /^#{filter}/i}).map do |u|
      {
        value: u.id.to_s,
        label: u.display_name,
        photo: u.photo&.url,
        first_name: u.first_name,
        last_name: u.last_name,
        roles: Common::Role.in(id: u.roles).map(&:name),
      }
    end

    render json: {data: users, status: 200}
  end
end
