class QueryAvailableCapacity
  prepend SimpleCommand

  def initialize(args = {})
    args = {
      :facility_id => nil,      # BSON::ObjectId, Facility.id
      :exclude_batch_id => nil, # BSON::ObjectId, Batch to exclude from tray plans. So schedules that conflic with itself can be ignored.
      :phase => nil,            # String, Phase (e.g. :clone, :veg1, :flower)
      :start_date => nil,       # Date object, Start Date of phase
      :end_date => nil,         # Date object, End Date of phase
      :quantity => 0,            # Integer, Capacity required by the Batch (Batch.quantity)
    }.merge(args)

    raise ArgumentError, 'facility_id' if args[:facility_id].nil?
    raise ArgumentError, 'start_date' if args[:start_date].nil?
    raise ArgumentError, 'end_date' if args[:end_date].nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if args[:end_date] < args[:start_date]
    raise ArgumentError, 'quantity' if args[:quantity] <= 0

    @facility_id = args[:facility_id]
    @exclude_batch_id = args[:exclude_batch_id]
    @phase = args[:phase]
    @start_date = args[:start_date]
    @end_date = args[:end_date]
    @quantity = args[:quantity]
  end

  # Check if a cultivation phase schedule is overlaping with other batches.
  def call
    cmd = QueryAvailableTrays.call(
      @start_date,
      @end_date,
      {
        facility_id: @facility_id,
        exclude_batch_id: @exclude_batch_id,
        purpose: [@phase],
      }
    )
    available_capacity = cmd.result.map(&:remaining_capacity).sum
  end
end
