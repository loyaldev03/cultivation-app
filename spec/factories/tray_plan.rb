FactoryBot.define do
  factory :tray_plan, class: Cultivation::TrayPlan do
    facility_id { "Fas1" }
    room_id { "Room1" }
    row_id { "Row1" }
    shelf_id { "Shelf1" }
    tray_id { "Tray1" }
    start_date { DateTime.now }
    end_date { DateTime.now + 10.days }
    capacity { 1 }
    is_active { true }
    is_fulfilled { false }
    batch { build(:batch) }
  end

  factory :batch, class: Cultivation::Batch do
    name {Faker::Name.name}
  end
end