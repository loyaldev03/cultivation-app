FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { "john.doe@example.com" }
    password { "password" }
    password_confirmation { "password" }
    is_active { true }
  end
end
