module Charts
  class QueryTotalActivePlant
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user

      raise ArgumentError, 'period is required' if args[:period].blank?
      raise ArgumentError, 'facility_ids is required' if args[:facility_ids].blank?
      raise ArgumentError, 'facility_ids must be an array' unless (args[:facility_ids].is_a? Array)

      @period = args[:period]
      @facility_ids = args[:facility_ids]
    end

    def call
      Inventory::Plant.collection.aggregate(
        [
          {"$match": {
            "cultivation_batch_id": {"$in": scopped_batch_ids},
          }},
          {"$project": {
            _id: 1,
          }},
        ],
      ).to_a.count
    end

    private

    def scopped_batch_ids
      @scopped_batch_ids ||= Charts::QueryActiveBatches.call(
        period: @period,
        facility_ids: @facility_ids,
      ).result
    end
  end
end
