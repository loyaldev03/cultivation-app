class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :email, :first_name, :last_name, :roles, :photo_url

  attribute :id do |object|
    object.id.to_s
  end
end
