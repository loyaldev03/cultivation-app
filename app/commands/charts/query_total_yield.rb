module Charts
  class QueryTotalYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user

      raise ArgumentError, 'period' if args[:period].blank?
      raise ArgumentError, 'facility_ids' if args[:facility_ids].blank?
      raise ArgumentError, 'facility_ids' unless (args[:facility_ids].is_a? Array)

      @period = args[:period]
      @facility_ids = args[:facility_ids]
    end

    def call
      Inventory::HarvestBatch.collection.aggregate([
        { "$match": {
            "cultivation_batch_id": {"$in": scopped_batch_ids}
          },
        },
        {"$addFields": {
          total: {
            "$sum": {
              "$cond": {
                "if": {"$eq": ['$total_cure_weight', 0]},
                "then": '$total_dry_weight',
                "else": '$total_cure_weight',
              },
            },
          },
        }},
        "$project": {
          _id: 0,
          total: 1,
        },
      ]).to_a.map { |x| x[:total] }.sum
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
