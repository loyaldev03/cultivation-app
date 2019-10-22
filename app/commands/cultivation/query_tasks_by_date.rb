module Cultivation
  class QueryTasksByDate
    prepend SimpleCommand

    def initialize(args = {})
      raise ArgumentError, 'date is required' if args[:date].blank?
      raise ArgumentError, 'facility_ids is required' if args[:facility_ids].blank?
      raise ArgumentError, 'facility_ids must be an array' unless args[:facility_ids].is_a? Array

      @facility_ids = args[:facility_ids]
      @start_date = args[:date].beginning_of_day
      @end_date = args[:date].end_of_day
    end

    def call
      # matches tasks exists between dates
      cond_a = Cultivation::Task.and({end_date: {"$gte": @start_date}},
                                      start_date: {"$lte": @end_date}).selector
      # matches tasks exists before end dates
      cond_b = Cultivation::Task.and({start_date: {"$gte": @start_date}},
                                      start_date: {"$lte": @end_date}).selector
      # matches tasks cover over start & end range
      cond_c = Cultivation::Task.and({start_date: {"$lte": @start_date}},
                                      end_date: {"$gte": @end_date}).selector

      Cultivation::Task.
        where(assignable: true).
        or(
          cond_a,
          cond_b,
          cond_c,
        ).to_a
    end
  end
end
