FactoryBot.define do
  factory :item_transaction, class: Inventory::ItemTransaction do
    product_name { Faker::Name.name }
    description { Faker::Lorem.word }
    manufacturer { Faker::Lorem.word }
    quantity { 100 }
    uom { 'g' }
    event_date { DateTime.now }
    production_cost { 50 }
    facility
    facility_strain { create(:facility_strain, facility: facility) }
    harvest_batch { build(:harvest_batch) }
    catalogue { create(:catalogue) }
  end
end
