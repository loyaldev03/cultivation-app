class QueryReadyTrays
  prepend SimpleCommand

  # NOTE: This query all the Trays in a Facility that are
  # ready to be use in cultivation
  #
  # :Facility: Facility.id
  # :purpose: Cultivation Phases in includes in the schedules
  # :exclude_batch_id: Batch to ignore. Usually the batch currently updating.
  def initialize(facility_id, purpose = [], exclude_batch_id = nil)
    raise ArgumentError, 'facility_id' if facility_id.nil?

    @facility_id = facility_id
    @purpose = purpose
    @exclude_batch_id = exclude_batch_id
  end

  def call
    cmd = QueryAvailableTrays.call(
      Date.new(2018, 1, 1),
      Date.new(2018, 1, 1),
      facility_id: @facility_id,
      purpose: @purpose,
      exclude_batch_id: @exclude_batch_id,
    )
    cmd.result
  rescue
    errors.add(:error, $!.message)
  end
end
