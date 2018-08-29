desc "Create sample Unit of Measure"
task seed_unit_of_measure: :environment do
  if Common::UnitOfMeasure.count == 0
    Common::UnitOfMeasure.create!([
      { name: "Each", code: "ea" },
      { name: "Kilogram", code: "kg" },
      { name: "Milligram", code: "mg" },
      { name: "Pound", code: "Lb" },
      { name: "Ounce", code: "Oz" },
      { name: "Bottle", code: "bottle" },
      { name: "Box", code: "box" },
    ])
  end
end
