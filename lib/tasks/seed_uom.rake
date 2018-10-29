desc "Seed Unit Of Measure data"
task seed_uom: :environment do
  Common::SeedUnitOfMeasure.call
end