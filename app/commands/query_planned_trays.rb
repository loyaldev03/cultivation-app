class QueryPlannedTrays
  prepend SimpleCommand

  # NOTE: This query all the "booked" of Trays

  attr_reader :start_date, :end_date

  def initialize(start_date, end_date, facility_id = nil, exclude_batch_id = nil)
    raise ArgumentError, 'start_date' if start_date.nil?
    raise ArgumentError, 'end_date' if end_date.nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if end_date <= start_date

    @start_date = start_date.beginning_of_day
    @end_date = end_date.end_of_day
    @facility_id = facility_id
    @exclude_batch_id = exclude_batch_id
  end

  def call
    query_records
  end

  private

  def query_records
    # NOTE: This should be in sync with the aggregate function in
    # QueryAvailableTrays > cultivation_tray_plans > lookup pipeline for dates
    cond_a = Cultivation::TrayPlan.and({end_date: {"$gte": @start_date}},
                                       start_date: {"$lte": @end_date}).selector
    cond_b = Cultivation::TrayPlan.and({start_date: {"$gte": @start_date}},
                                       start_date: {"$lte": @end_date}).selector
    cond_c = Cultivation::TrayPlan.and({start_date: {"$lte": @start_date}},
                                       end_date: {"$gte": @end_date}).selector

    planned = Cultivation::TrayPlan.or(cond_a, cond_b, cond_c)
    planned = planned.where(facility_id: @facility_id.to_bson_id) if @facility_id
    planned = planned.not.where(batch_id: @exclude_batch_id.to_bson_id) if @exclude_batch_id
    # TODO::ANDY filter out inactive batches
    planned.to_a
  end
end
