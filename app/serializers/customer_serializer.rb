class CustomerSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name, :account_no, :status, :state_license, :license_type, :mobile_number

  attribute :id do |object|
    object.id.to_s
  end

  attribute :addresses do |object|
    object.addresses
  end
end
