class QueryRoomsByBatch
  prepend SimpleCommand

  def initialize(batch_id)
    raise ArgumentError, 'batch_id' if batch_id.nil?

    @batch_id = batch_id.to_bson_id
  end

  def call
    criteria = Cultivation::TrayPlan.collection.aggregate [
      {"$match": {"batch_id": @batch_id}},
      {"$lookup": {
        "from": 'facilities',
        "localField": 'facility_id',
        "foreignField": '_id',
        "as": 'facility',
      }},
      {"$unwind": {
        "path": '$facility', preserveNullAndEmptyArrays: false,
      }},
      {"$unwind": {
        "path": '$facility.rooms', preserveNullAndEmptyArrays: false,
      }},
      {"$group": {
        "_id": {"room_name": '$facility.rooms.name',
                "room_purpose": '$facility.rooms.purpose'},
      }},
      {"$project": {
        "_id": 0,
        "room_name": '$_id.room_name',
        "room_purpose": '$_id.room_purpose',
      }},
    ]

    criteria.to_a
  rescue StandardError
    errors.add(:error, $!.message)
  end
end
