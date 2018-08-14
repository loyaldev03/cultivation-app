class QueryUnitOfMeasure
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    query_records(@args)
  end

  private

  def query_records(args)
    Common::UnitOfMeasure.where(args).to_a
  end
end
