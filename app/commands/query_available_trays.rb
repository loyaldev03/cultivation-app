class QueryAvailableTrays
  prepend SimpleCommand

  def initialize(start_date, end_date, filter = {})
    raise ArgumentError, 'start_date' if start_date.nil?
    raise ArgumentError, 'end_date' if end_date.nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if end_date <= start_date

    @start_date = start_date.beginning_of_day
    @end_date = end_date.end_of_day

    # Optional match clauses
    @facility_id = filter[:facility_id].to_bson_id if filter[:facility_id]
    @purpose = filter[:purpose]
    @exclude_batch_id = filter[:exclude_batch_id].to_bson_id if filter[:exclude_batch_id]
  end

  def call
    query_records
  end

  private

  def match_facility
    if @facility_id
      {"$match": {_id: @facility_id}}
    else
      {"$match": {}}
    end
  end

  def match_purpose
    if @purpose
      {"$match": {tray_purpose: @purpose}}
    else
      {"$match": {}}
    end
  end

  def query_records
    criteria = Facility.collection.aggregate [
      match_facility,
      {"$project": {_id: 0, facility_id: '$_id', facility_code: '$code', facility_name: '$name', rooms: 1}},
      {"$unwind": '$rooms'},
      {"$unwind": '$rooms.rows'},
      {"$unwind": '$rooms.rows.shelves'},
      {"$match": {
        "$and": [
          {"rooms.is_complete": true},
          {"rooms.rows.shelves.is_complete": true},
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
      {"$unwind": '$trays'},
      {"$match": {"trays.capacity": {"$ne": nil}}},
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
          {"$project": {capacity: '$capacity', start_date: '$start_date', end_date: '$end_date'}},
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
        row_id: '$rooms.rows._id',
        row_name: '$rooms.rows.name',
        row_code: '$rooms.rows.code',
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

    res = criteria.map do |x|
      OpenStruct.new({
        facility_id: x[:facility_id].to_s,
        facility_code: x[:facility_code],
        facility_name: x[:facility_name],
        room_id: x[:room_id].to_s,
        room_is_complete: x[:room_is_complete],
        room_name: x[:room_name],
        room_code: x[:room_code],
        room_purpose: x[:room_purpose],
        row_id: x[:row_id].to_s,
        row_name: x[:row_name],
        row_code: x[:row_code],
        section_id: x[:section_id].to_s,
        section_name: x[:section_name],
        section_code: x[:section_code],
        section_purpose: x[:section_purpose],
        shelf_id: x[:shelf_id].to_s,
        shelf_code: x[:shelf_code],
        shelf_name: x[:shelf_name],
        shelf_capacity: x[:shelf_capacity],
        tray_id: x[:tray_id].to_s,
        tray_code: x[:tray_code],
        tray_capacity: x[:tray_capacity],
        tray_capacity_type: x[:tray_capacity_type],
        tray_purpose: x[:tray_purpose],
        planned_capacity: x[:planned_capacity],
        remaining_capacity: x[:remaining_capacity],
      }).marshal_dump
    end

    res
  end
end
