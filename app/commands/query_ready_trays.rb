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
    purposes = get_purpose_filter
    cmd = QueryAvailableTrays.call(
      start_date: Date.new(1900, 1, 1),
      end_date: Date.new(1900, 1, 1),
      facility_id: @facility_id,
      purpose: purposes,
      exclude_batch_id: @exclude_batch_id,
    )
    cmd.result
  rescue StandardError
    errors.add(:error, $!.message)
  end

  private

  def get_purpose_filter
    if !@purpose.blank?
      return @purpose
    end

    purposes_cmd = Common::QueryAvailableRoomPurpose.call
    purposes_cmd.active_growth_stages
  end
end
