RSpec.configure do |config|
  config.filter_run :focus => true
  config.run_all_when_everything_filtered = true
  config.example_status_persistence_file_path = "tmp/rspec-example-status.txt"

  # stick to 1 type of syntax for consistency
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
  # config.around(:each) do |example|
  #   example.run.tap do |result|
  #     debugger if result.is_a?(RSpec::Expectations::ExpectationNotMetError)
  #   end
  # end
end
