class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :email

  attribute :full_name do |object|
    object.display_name
  end

  attribute :roles do |object|
    object.roles.map { |a| a.to_s }
  end
end
