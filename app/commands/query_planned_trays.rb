class QueryPlannedTrays
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    query_records
  end

  private

  def query_records
    Cultivation::TrayPlan.where(args).to_a
  end
end
