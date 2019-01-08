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

  def by_facility
    facility_id = BSON::ObjectId(params[:facility_id])
    filter = params[:filter] || ''
    users = User.in(facilities: facility_id).any_of({last_name: /^#{filter}/i}, {first_name: /^#{filter}/i}).map do |x|
      {
        value: x.id.to_s,
        label: "#{x.display_name} - #{x.email}",
        photo: x.photo&.url,
        first_name: x.first_name,
        last_name: x.last_name,
      }
    end

    render json: {data: users, status: 200}
  end
end
