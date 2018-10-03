class RolesSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name

  attribute :id do |object|
    object.id.to_s
  end
end
