module Charts
  class QueryActiveBatches
    prepend SimpleCommand

    def initialize(args = {})
      @period = args[:period]
      # NOTE: facility_ids should not be empty when calling this command
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
      criteria.to_a&.map { |x| x["_id"] }
    end

    private

    def match_facilities
      if @facility_ids && (@facility_ids.is_a? Array) && @facility_ids.any?
        {"$match": {facility_id: {"$in": @facility_ids}}}
      else
        {"$match": {}}
      end
    end

    def match_active_period
      if @period == 'all'
        {"$match": {
          "$or": [{"status": "ACTIVE"}, {"status": "COMPLETED"}],
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
          "$or": [{"status": "ACTIVE"}, {"status": "COMPLETED"}],
          "start_date": {"$gte": start_date},
        }}
      end
    end
  end
end
