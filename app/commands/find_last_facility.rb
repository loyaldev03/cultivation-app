class FindLastFacility
  prepend SimpleCommand

  attr_reader :args

  def initialize
  end

  def call
    query_record
  end

  private

  def query_record
    record = Facility.last
    if record.nil?
      errors.add :not_found, 'Record Not Found'
      nil
    else
      record
    end
  end
end
