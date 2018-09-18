class QueryPlannedTrays
  prepend SimpleCommand

  # NOTE: This query all the "booked" of Trays

  attr_reader :start_date, :end_date

  def initialize(start_date, end_date)
    raise ArgumentError, 'start_date' if start_date.nil?
    raise ArgumentError, 'end_date' if end_date.nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if end_date <= start_date

    @start_date = start_date.beginning_of_day
    @end_date = end_date.end_of_day
  end

  def call
    query_records
  end

  private

  def query_records
    # NOTE: This should be in sync with the aggregate function in
    # QueryAvailableTrays > cultivation_tray_plans > lookup pipeline
    cond_a = Cultivation::TrayPlan.and({end_date: {"$gte": @start_date}}, {start_date: {"$lte": @end_date}}).selector
    cond_b = Cultivation::TrayPlan.and({start_date: {"$gte": @start_date}}, {start_date: {"$lte": @end_date}}).selector
    cond_c = Cultivation::TrayPlan.and({start_date: {"$lte": @start_date}}, {end_date: {"$gte": @end_date}}).selector

    planned = Cultivation::TrayPlan.or(cond_a, cond_b, cond_c).to_a
    planned
  end
end
