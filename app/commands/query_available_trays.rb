class QueryAvailableTrays
  prepend SimpleCommand

  def initialize(args = {})
    args = {
      facility_ids: nil,
      exclude_batch_id: nil,
      purpose: nil,
      start_date: nil,
      end_date: nil,
    }.merge(args)

    raise ArgumentError, 'start_date' if args[:start_date].nil?
    raise ArgumentError, 'end_date' if args[:end_date].nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if args[:end_date] < args[:start_date]

    @facility_ids = args[:facility_ids]&.map(&:to_bson_id)
    @exclude_batch_id = args[:exclude_batch_id]&.to_bson_id
    @purpose = args[:purpose]
    @start_date = args[:start_date]
    @end_date = args[:end_date]
  end

  def call
    query_records
  end

  private

  def match_facilities
    if @facility_ids && (@facility_ids.is_a? Array) && @facility_ids.any?
      {"$match": {facility_id: {"$in": @facility_ids}}}
    else
      {"$match": {}}
    end
  end

  def match_purpose
    if @purpose && (@purpose.is_a? Array) && @purpose.any?
      {"$match": {tray_purpose: {'$in': @purpose}}}
    else
      {"$match": {}}
    end
  end

  def query_records
    criteria = Facility.collection.aggregate [
      match_facilities,
      {"$project": {_id: 0, facility_id: '$_id', facility_code: '$code', facility_name: '$name', rooms: 1}},
      {"$unwind": {path: '$rooms', preserveNullAndEmptyArrays: true}},
      {"$unwind": {path: '$rooms.rows', preserveNullAndEmptyArrays: true}},
      {"$unwind": {path: '$rooms.rows.shelves', preserveNullAndEmptyArrays: true}},
      {"$match": {
        "$or": [
          {"$and": [
            {"rooms.is_complete": true},
            {"rooms.rows.shelves.is_complete": true},
          ]},
          {"rooms.rows.shelves": nil},
        ],
      }},
      {"$lookup": {
        from: 'facilities',
        let: {"sectionId": '$rooms.rows.section_id'},
        pipeline: [
          {"$unwind": '$rooms'},
          {"$unwind": '$rooms.sections'},
          {"$match": {"$expr": {"$eq": ['$rooms.sections._id', '$$sectionId']}}},
          {"$project": {
            _id: 0,
            section_id: '$rooms.sections._id',
            section_name: '$rooms.sections.name',
            section_code: '$rooms.sections.code',
            section_purpose: '$rooms.sections.purpose',
          }},
        ],
        as: 'section',
      }},
      {"$unwind": {path: '$section', preserveNullAndEmptyArrays: true}},
      {"$addFields": {
        "tray_purpose": {"$ifNull": ['$section.section_purpose', '$rooms.purpose']},
      }},
      match_purpose,
      {"$lookup": {
        from: 'trays',
        localField: 'rooms.rows.shelves._id',
        foreignField: 'shelf_id',
        as: 'trays',
      }},
      {"$unwind": {path: '$trays', preserveNullAndEmptyArrays: true}},
      {"$match": {
        "$or": [
          {"trays.capacity": {"$ne": nil}}, {"trays": {"$eq": nil}},
        ],
      }},
      {"$lookup": {
        from: 'cultivation_tray_plans',
        let: {
          "trayId": '$trays._id',
          "startDate": @start_date,
          "endDate": @end_date,
          "batchId": @exclude_batch_id,
        },
        pipeline: [
          {"$match": {
            "$expr": {
              "$and": [
                {"$eq": ['$tray_id', '$$trayId']},
                {"$ne": ['$batch_id', '$$batchId']},
              ],
            },
          }},
          {"$match": {
            "$expr": {
              "$or": [
                {"$and": [{"$gte": ['$end_date', '$$startDate']}, {"$lte": ['$start_date', '$$endDate']}]},
                {"$and": [{"$gte": ['$start_date', '$$startDate']}, {"$lte": ['$start_date', '$$endDate']}]},
                {"$and": [{"$lte": ['$start_date', '$$startDate']}, {"$gte": ['$end_date', '$$endDate']}]},
              ],
            },
          }},
          {"$lookup": {
            from: 'cultivation_batches',
            localField: 'batch_id',
            foreignField: '_id',
            as: 'batch',
          }},
          {"$addFields": {"batch": {"$arrayElemAt": ['$batch', 0]}}},
          {"$project": {batch_status: '$batch.status', capacity: 1, start_date: 1, end_date: 1}},
          {"$match": {
            "$expr": {
              "$and": [
                {"$ne": ['$batch_status', Constants::BATCH_STATUS_DRAFT]},
                {"$ne": ['$batch_status', Constants::BATCH_STATUS_COMPLETED]},
              ],
            },
          }},
        ],
        as: 'planned',
      }},
      {"$addFields": {
        "planned_capacity": {"$sum": '$planned.capacity'},
      }},
      {"$addFields": {
        "remaining_capacity": {"$subtract": ['$trays.capacity', '$planned_capacity']},
      }},
      {"$project": {
        facility_id: '$facility_id',
        facility_code: 1,
        facility_name: 1,
        room_id: '$rooms._id',
        room_is_complete: '$rooms.is_complete',
        room_name: '$rooms.name',
        room_code: '$rooms.code',
        room_purpose: '$rooms.purpose',
        room_has_sections: '$rooms.has_sections',
        row_id: '$rooms.rows._id',
        row_name: '$rooms.rows.name',
        row_code: '$rooms.rows.code',
        row_has_shelves: '$rooms.rows.has_shelves',
        row_has_trays: '$rooms.rows.has_trays',
        section_id: '$section.section_id',
        section_name: '$section.section_name',
        section_code: '$section.section_code',
        section_purpose: '$section.section_purpose',
        shelf_id: '$rooms.rows.shelves._id',
        shelf_code: '$rooms.rows.shelves.code',
        shelf_name: '$rooms.rows.shelves.name',
        shelf_capacity: '$rooms.rows.shelves.capacity',
        tray_id: '$trays._id',
        tray_code: '$trays.code',
        tray_capacity: '$trays.capacity',
        tray_capacity_type: '$trays.capacity_type',
        tray_purpose: 1,
        planned_capacity: 1,
        remaining_capacity: 1,
      }},
    ]

    criteria.map { |x| AvailableTray.new(x) } || []
  end
end
