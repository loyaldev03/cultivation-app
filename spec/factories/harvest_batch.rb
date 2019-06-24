FactoryBot.define do
  factory :harvest_batch, class: Inventory::HarvestBatch do
    harvest_name { Faker::Lorem.word }
    harvest_date { Time.current }
    status { 'new' }
  end
end
