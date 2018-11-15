FactoryBot.define do
  factory :batch, class: Cultivation::Batch do
    batch_no { Faker::Number.number(4) }
    start_date { Time.now }
    quantity { Faker::Number.number(2).to_i }
    facility_strain { build(:facility_strain) }
    is_active { true }
  end
end
