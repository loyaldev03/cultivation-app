RSpec.configure do |config|
  config.example_status_persistence_file_path = "tmp/rspec-example-status.txt"
  config.around(:each) do |example|
    example.run.tap do |result|
      debugger if result.is_a?(RSpec::Expectations::ExpectationNotMetError)
    end
  end
end
