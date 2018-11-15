FactoryBot.define do
  factory :facility do
    name { Faker::Lorem.word }
    code { Faker::Number.number(2) }

    trait :is_complete do
      company_name { Faker::Company.name }
      state_license { Faker::Code.asin }
      site_license { Faker::Address.country }
      timezone { Faker::Address.country }
      is_complete { true }
      address { build(:address) }
      rooms do
        [
          build(:room, :mother, :is_complete),
          build(:room, :clone, :is_complete),
          build(:room, :veg, :is_complete),
          build(:room, :flower, :is_complete),
          build(:room, :dry, :is_complete),
          build(:room, :cure, :is_complete),
        ]
      end
    end
  end

  factory :room do
    trait :mother do
      name { "Mother Room" }
      code { "Rm01" }
      purpose { Constants::CONST_MOTHER }
    end

    trait :clone do
      name { "Clone Room" }
      code { "Rm02" }
      purpose { Constants::CONST_CLONE }
    end

    trait :veg do
      name { "Veg Room" }
      code { "Rm03" }
      purpose { Constants::CONST_VEG }
    end

    trait :flower do
      name { "Flower Room" }
      code { "Rm04" }
      purpose { Constants::CONST_FLOWER }
    end

    trait :dry do
      name { "Dry Room" }
      code { "Rm05" }
      purpose { Constants::CONST_DRY }
    end

    trait :cure do
      name { "Cure Room" }
      code { "Rm06" }
      purpose { Constants::CONST_CURE }
    end

    trait :is_complete do
      is_complete { true }
      wz_generated { false }
      rows do
        [
          build(:row, :row1, :is_complete),
          build(:row, :row2, :is_complete),
        ]
      end
    end
  end

  factory :row do
    trait :row1 do
      name { "Row One" }
      code { "Rw01" }
    end

    trait :row2 do
      name { "Row Two" }
      code { "Rw02" }
    end

    trait :is_complete do
      is_complete { true }
      wz_generated { false }
      has_shelves { true }
      has_trays { true }
      shelves do
        [
          build(:shelf, :shelf1, :is_complete),
          build(:shelf, :shelf2, :is_complete),
        ]
      end
    end
  end

  factory :shelf do
    trait :shelf1 do
      code { "Sf01" }
    end

    trait :shelf2 do
      code { "Sf02" }
    end

    trait :is_complete do
      is_complete { true }
      wz_generated { false }
      is_use_trays { true }
      capacity { 20 }
      trays do
        [
          build(:tray, :tray1),
          build(:tray, :tray2),
        ]
      end
    end
  end

  factory :tray do
    wz_generated { false }
    trait :tray1 do
      code { "TR001" }
      capacity { 10 }
      capacity_type { "cups" }
    end
    trait :tray2 do
      code { "TR002" }
      capacity { 10 }
      capacity_type { "cups" }
    end
  end
end
