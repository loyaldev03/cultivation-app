class FindFacility
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    query_facility
  end

  private

  def query_facility
    facility = Facility.where(@args).first
    if facility.nil?
      errors.add :not_found, 'Record Not Found'
      nil
    else
      facility
    end
  end
end
