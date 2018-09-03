class QueryVendor
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
    Inventory::Vendor.where(@args).to_a
  end
end
