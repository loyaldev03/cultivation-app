# READ = 1
# UPDATE = 2
# CREATE = 4
# DELETE = 8

FactoryBot.define do
  factory :role, class: Common::Role do
    name {Faker::Name.name}

    trait :with_permission_1010 do
      permissions {[
        {code: 1010, value: CAN_READ }, # READ Invoices
        {code: 1020, value: (CAN_READ | CAN_UPDATE | CAN_CREATE)},
      ]}
    end

    trait :super_admin do
      name { "Super Admin" }
      built_in { true }
    end
  end
end

