RSpec.configure do |config|
  config.use_transactional_fixtures = false

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
    # Seed master data before tests
    Common::SeedUnitOfMeasure.call
    Inventory::SeedCatalogue.call
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :truncation, {
      except: %w[inventory_catalogues common_unit_of_measures],
    }
  end

  config.before(:each, js: true) do
    DatabaseCleaner.strategy = :truncation, {
      except: %w[inventory_catalogues common_unit_of_measures],
    }
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
