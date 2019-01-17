FactoryBot.define do
  factory :batch, class: Cultivation::Batch do
    batch_no { Faker::Number.number(4) }
    start_date { Time.now }
    quantity { Faker::Number.number(2).to_i }
    is_active { true }
    facility
    facility_strain { build(:facility_strain, facility: facility) }
  end
end
