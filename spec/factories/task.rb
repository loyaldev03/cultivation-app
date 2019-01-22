FactoryBot.define do
  factory :task, class: Cultivation::Task do
    duration = Faker::Number.number(1)

    batch { build(:batch) }
    name { Faker::Lorem.word }
    duration { duration }
    phase { Constants::CONST_CLONE }
    start_date { Time.now }
    end_date { Time.now + duration.to_i.days }
  end
end
