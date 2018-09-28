class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :email, :role

  attribute :full_name do |object|
    object.display_name
  end
end
