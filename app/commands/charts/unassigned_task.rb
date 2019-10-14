module Charts
  class UnassignedTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',').map { |x| x.to_bson_id }
    end

    def call
      Cultivation::Task.collection.aggregate([
        {"$match": {"facility_id": {"$in": @facility_id}}},
        {"$match": {"user_ids": {"$eq": nil}}},
        {"$lookup": {
          "from": 'cultivation_batches',
          "let": {"batch_id": '$batch_id'},
          "pipeline": [
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$id', '$$batch_id']},
                  ],
                },
              },
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$status', 'ACTIVE']},
                  ],
                },
              },
            },
          ],
          "as": 'batches',
        }},
        {"$project": {
          name: 1,
          batch_id: 1,
          start_date: 1,
          end_date: 1,
        }},
      ])
    end
  end
end
