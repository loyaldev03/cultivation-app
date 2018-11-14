FactoryBot.define do
  factory :batch, class: Cultivation::Batch do
    batch_no { Faker::Number.number(4) }
    facility_strain { build(:facility_strain) }
    is_active { true }
  end
end
