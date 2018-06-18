FactoryBot.define do
  factory :user do
    first_name 'John'
    last_name 'Doe'
    email 'john.doe@example.com'
    password 'password'
    password_confirmation 'password'

    trait :admin do
    end

    trait :dev do
    end
  end
end
