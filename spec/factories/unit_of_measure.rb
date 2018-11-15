FactoryBot.define do
  factory :unit_of_measure, class: Common::UnitOfMeasure do
    trait :kg do
      name { "Kilograms" }
      unit { "kg" }
      base_unit { "g" }
      conversion { 1000 }
    end

    trait :ea do
      name { "Each" }
      unit { "ea" }
    end

    trait :lb do
      name { "Pound" }
      unit { "Lb" }
    end

    trait :g do
      name { "Grams" }
      unit { "g" }
      is_base_unit { true }
    end

    trait :mg do
      name { "Milligrams" }
      unit { "mg" }
    end

    trait :oz do
      name { "Ounce" }
      unit { "Oz" }
    end
  end
end
