FactoryBot.define do
  factory :product, class: Inventory::Product do
    name { Faker::Lorem.word }
    description { Faker::Lorem.word }
    manufacturer { Faker::Lorem.word }
    catalogue { build(:catalogue) }
    facility { build(:facility) }
    facility_strain { build(:facility_strain) }
  end
end