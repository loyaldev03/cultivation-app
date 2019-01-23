FactoryBot.define do
  factory :tray_plan, class: Cultivation::TrayPlan do
    facility_id { "Fas1" }
    room_id { "Room1" }
    row_id { "Row1" }
    shelf_id { "Shelf1" }
    tray_id { "Tray1" }
    start_date { Time.now }
    end_date { Time.now + 10.days }
    capacity { 1 }
    batch

    trait :clone do
      phase { Constants::CONST_CLONE }
    end

    trait :veg do
      phase { Constants::CONST_VEG }
    end

    trait :veg1 do
      phase { Constants::CONST_VEG1 }
    end

    trait :veg2 do
      phase { Constants::CONST_VEG2 }
    end

    trait :dry do
      phase { Constants::CONST_DRY }
    end

    trait :cure do
      phase { Constants::CONST_CURE }
    end
  end
end
