# PERMISSION_NONE = 0
# PERMISSION_READ = 1
# PERMISSION_UPDATE = 2
# PERMISSION_CREATE = 4
# PERMISSION_DELETE = 8

FactoryBot.define do
  factory :role, class: Common::Role do
    name {Faker::Name.name}

    trait :with_permission_1010 do
      permissions {[
        {code: 1010, value: Constants::PERMISSION_READ }, # READ Invoices
        {code: 1020, value: (
          Constants::PERMISSION_READ |
          Constants::PERMISSION_UPDATE |
          Constants::PERMISSION_CREATE )
        },
      ]}
    end
  end
end

