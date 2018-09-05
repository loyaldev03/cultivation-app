FactoryBot.define do
  factory :address do
    name {Faker::Name.name}
    address {Faker::Address.street_name}
    city {Faker::Address.city}
    state {Faker::Address.state}
    zipcode {Faker::Address.zip}
    country {Faker::Address.country}
    main_number {Faker::PhoneNumber.phone_number}
    mobile_number {Faker::PhoneNumber.phone_number}
    fax_number {Faker::PhoneNumber.phone_number}
    email {Faker::Internet.email}
  end
end
