module Charts
  class QueryActiveBatchesCost
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
      criteria = Cultivation::Batch.collection.aggregate([
        {"$match": {
          "_id": {"$in": scopped_batch_ids},
        }},
        {"$addFields": {
          "actual_cost": {"$add": ['$actual_labor_cost', '$actual_material_cost']},
        }},
        {"$group": {
          "_id": 'result',
          "actual_cost": {"$sum": '$actual_cost'},
        }},
      ])
      # calling to_a can be empty array when no data
      res = criteria.to_a
      res.any? ? res.dig(0, 'actual_cost') : 0.0
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
