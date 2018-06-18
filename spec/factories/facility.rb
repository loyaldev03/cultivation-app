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
      rooms { [build(:room, :room_1), build(:room)] }
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
  end
end
