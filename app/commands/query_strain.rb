class QueryStrain
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
    Common::Strain.where(@args).to_a
  end
end
