module Charts
  class QueryActiveBatches
    prepend SimpleCommand

    def initialize(args = {})
      @period = args[:period]
      # facility_ids should not be empty when calling this command
      raise ArgumentError, 'facility_ids' if args[:facility_ids].blank?
      # facility_ids must be an array of facility ids
      raise ArgumentError, 'facility_ids' unless (args[:facility_ids].is_a? Array)
      @facility_ids = args[:facility_ids]&.map(&:to_bson_id)
    end

    def call
      criteria = Cultivation::Batch.collection.aggregate(
        [
          match_facilities,
          match_active_period,
          {
            "$project": {
              _id: 1,
            },
          },
        ],
      )
      criteria.to_a&.map { |x| x['_id'] }
    end

    private

    def match_facilities
      {"$match": {facility_id: {"$in": @facility_ids}}}
    end

    def match_active_period
      if @period == 'all'
        {"$match": {
          "$or": [{"status": 'ACTIVE'}, {"status": 'COMPLETED'}],
        }}
      else
        date = Time.current
        start_date = if @period == 'this_year'
                       date.beginning_of_year
                     elsif @period == 'this_month'
                       date.beginning_of_month
                     elsif @period == 'this_week'
                       date.beginning_of_week
                     end
        {"$match": {
          "$or": [{"status": 'ACTIVE'}, {"status": 'COMPLETED'}],
          "start_date": {"$gte": start_date},
        }}
      end
    end
  end
end
