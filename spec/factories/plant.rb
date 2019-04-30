FactoryBot.define do
  factory :plant, class: Inventory::Plant do
    modifier { build(:user) }
    cultivation_batch { build(:batch) }
    facility_strain { build(:facility_strain) }
    plant_id { Faker::Code.nric }
    location_id { BSON::ObjectId.new }

    trait :mother do
      current_growth_stage { Constants::CONST_MOTHER }
      location_type { "tray" }
    end

    trait :clone do
      current_growth_stage { Constants::CONST_CLONE }
      location_type { "tray" }
    end

    trait :veg do
      current_growth_stage { Constants::CONST_VEG }
      location_type { "tray" }
    end

    trait :veg1 do
      current_growth_stage { Constants::CONST_VEG1 }
      location_type { "tray" }
    end

    trait :veg2 do
      current_growth_stage { Constants::CONST_VEG2 }
      location_type { "tray" }
    end

    trait :flower do
      current_growth_stage { Constants::CONST_FLOWER }
      location_type { "tray" }
    end
  end
end
