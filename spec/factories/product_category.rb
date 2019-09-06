FactoryBot.define do
  factory :product_category, class: Inventory::ProductCategory do
    name { Faker::Lorem.word }
  end
end
