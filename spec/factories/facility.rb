FactoryBot.define do
  factory :facility do
    trait :after_step_1 do
      name 'Facility 1'
      code 'Fa1'
      rooms []
    end

    trait :after_step_2 do
      name 'Facility 1'
      code 'Fa1'
      room_count 2
      rooms { [build(:room), build(:room)] }
    end

    trait :after_step_3 do
      name 'Facility 1'
      code 'Fa1'
      room_count 2
      rooms { [build(:room, :room_1_with_2_sections), build(:room)] }
    end

    trait :after_step_4 do
      name 'Facility 1'
      code 'Fa1'
      room_count 2
      rooms { [build(:room, :room_1), build(:room)] }
    end

    trait :facility_with_rooms_sections do
      name 'Facility 1'
      code 'Fa1'
      room_count 1
      rooms { [build(:room, :room_1_with_2_sections)] }
    end

    trait :facility_with_rooms_sections_row do
      name 'Facility 1'
      code 'Fa1'
      room_count 1
      rooms { [build(:room, :room_1_with_2_sections_row)] }
    end
  end

  factory :room do
    trait :room_1 do
      name 'Room 1'
      code 'Rm1'
    end

    trait :room_2 do
      name 'Room 2'
      code 'Rm2'
    end

    trait :room_1_with_2_sections do
      name 'Room 1'
      code 'Rm1'
      sections { [build(:section, :section_1),build(:section, :section_2)] }
    end

    trait :room_1_with_2_sections_row do
      name 'Default Room 1'
      code 'DefaultRm1'
      sections { [build(:section, :section_1_row)] }
    end
  end

  factory :section do
    row_count 10
    shelf_count 5
    shelf_capacity 20
    purpose 'storage'

    trait :section_1 do
      name 'Section 1'
      code 'Sec1'
    end

    trait :section_1_row do
      name 'Section 1'
      code 'Sec1'
      rows { [build(:row)] }
    end

    trait :section_2 do
      name 'Section 2'
      code 'Sec2'
    end

    trait :complete do
      is_complete false
    end
  end

  factory :row do
    name 'Default Row'
    code 'DefRw1'
  end
end
