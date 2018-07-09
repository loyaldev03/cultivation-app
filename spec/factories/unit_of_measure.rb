FactoryBot.define do
  factory :unit_of_measure do
    trait :kg do
      name 'Kilograms'
      code 'kg'
    end

    trait :ea do
      name 'Each'
      code 'ea'
    end

    trait :lb do
      name 'Pound'
      code 'Lb'
    end

    trait :mg do
      name 'Milligrams'
      code 'mg'
    end

    trait :oz do
      name 'Ounce'
      code 'Oz'
    end
  end
end
