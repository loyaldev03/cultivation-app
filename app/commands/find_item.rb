class FindItem
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    query_record
  end

  private

  def query_record
    nil
    # record = Inventory::Item.where(@args).first
    # if record.nil?
    #   errors.add :not_found, 'Record Not Found'
    #   nil
    # else
    #   record
    # end
  end
end
