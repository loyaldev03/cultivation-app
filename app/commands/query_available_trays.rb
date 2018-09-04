class QueryAvailableTrays
  prepend SimpleCommand

  # NOTE: Find Trays that are not booked between dates

  attr_reader :start_date, :end_date

  def initialize(start_date, end_date)
    @start_date = start_date
    @end_date = end_date
  end

  def call
    query_records
  end

  private

  def query_records
    cond_a = Cultivation::TrayPlan.and({ end_date: { "$gt": @start_date } }, { end_date: { "$lte": @end_date } }).selector
    cond_b = Cultivation::TrayPlan.and({ start_date: { "$gte": @start_date } }, { start_date: { "$lt": @end_date } }).selector
    cond_c = Cultivation::TrayPlan.and({ start_date: { "$lte": @start_date } }, { end_date: { "$gte": @end_date } }).selector

    ready = QueryReadyTrays.call
    planned = Cultivation::TrayPlan.or(cond_a, cond_b, cond_c).to_a

    # TODO: Return only unplanned Trays
  end
end
