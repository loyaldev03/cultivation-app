class QueryAvailableCapacity
  prepend SimpleCommand

  def initialize(args = {})
    args = {
      facility_id: nil,      # BSON::ObjectId, Facility.id
      exclude_batch_id: nil, # BSON::ObjectId, Batch to exclude from tray plans. So schedules that conflic with itself can be ignored.
      phase: nil,            # String, Phase (e.g. :clone, :veg1, :flower)
      start_date: nil,       # Date object, Start Date of phase
      end_date: nil,         # Date object, End Date of phase
    }.merge(args)

    raise ArgumentError, 'facility_id' if args[:facility_id].nil?
    raise ArgumentError, 'start_date' if args[:start_date].nil?
    raise ArgumentError, 'end_date' if args[:end_date].nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if args[:end_date] < args[:start_date]

    @facility_id = args[:facility_id]
    @exclude_batch_id = args[:exclude_batch_id]
    @phase = args[:phase]
    @start_date = args[:start_date]
    @end_date = args[:end_date]
  end

  # Check if a cultivation phase schedule is overlaping with other batches.
  def call
    available_trays = QueryAvailableTrays.call(
      start_date: @start_date,
      end_date: @end_date,
      facility_id: @facility_id,
      exclude_batch_id: @exclude_batch_id,
      purpose: [@phase],
    ).result

    res = available_trays.group_by(&:tray_purpose).map do |tray_purpose, trays|
      {
        tray_purpose: tray_purpose,
        remaining_capacity: trays.sum { |t| t.remaining_capacity },
      }
    end

    # Return the lowest number of remaining capacity across all phases
    available_capacity = res.pluck(:remaining_capacity).min
    available_capacity
  end
end
