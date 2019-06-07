FactoryBot.define do
  factory :batch, class: Cultivation::Batch do
    batch_no { Faker::Number.number(4) }
    name { Faker::Name.name }
    start_date { Time.current }
    quantity { Faker::Number.number(2).to_i }
    status { Constants::BATCH_STATUS_DRAFT }

    trait :scheduled do
      status { Constants::BATCH_STATUS_SCHEDULED }
    end

    trait :active do
      status { Constants::BATCH_STATUS_ACTIVE }
    end

    facility
    facility_strain { build(:facility_strain, facility: facility) }
  end
end
