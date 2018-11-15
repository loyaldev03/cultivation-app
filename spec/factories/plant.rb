FactoryBot.define do
  factory :plant, class: Inventory::Plant do
    created_by { build(:user) }
    cultivation_batch { build(:batch) }
    facility_strain { build(:facility_strain) }
    plant_id { Faker::Code.nric }
    location_id { BSON::ObjectId.new }

    trait :clone do
      current_growth_stage { Constants::CONST_CLONE }
      location_type { "tray" }
    end
  end
end
