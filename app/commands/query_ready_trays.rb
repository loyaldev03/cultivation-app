class QueryReadyTrays
  prepend SimpleCommand

  # NOTE: This query all the Trays in a Facility that are
  # ready to be use in cultivation

  def initialize(facility_id, purpose = nil)
    raise ArgumentError, 'facility_id' if facility_id.nil?
    
    @facility_id = facility_id
    @purpose = purpose
  end

  def call
    cmd = QueryAvailableTrays.call(
      Date.new(2018,1,1),
      Date.new(2018,1,1),
      {
        facility_id: @facility_id,
        purpose: @purpose
      }
    )
    result = cmd.result
    result ||= []
  end
end
