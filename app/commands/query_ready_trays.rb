class QueryReadyTrays
  prepend SimpleCommand

  # NOTE: This query all the Trays in a Facility that are
  # ready to be use in cultivation

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    query_records
  end

  private

  def query_records
    result = Facility.collection.aggregate [
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
          {"$project": {_id: 0, section_id: '$rooms.sections._id', section_name: '$rooms.sections.name'}},
        ],
        as: 'section',
      }},
      {"$unwind": {path: '$section', preserveNullAndEmptyArrays: true}},
      {"$lookup": {
        from: 'trays',
        localField: 'rooms.rows.shelves._id',
        foreignField: 'shelf_id',
        as: 'trays',
      }},
      {"$unwind": '$trays'},
      {"$match": {"trays.capacity": {"$ne": nil}}},
      {"$project": {
        facility_id: 1,
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
        shelf_id: '$rooms.rows.shelves._id',
        shelf_code: '$rooms.rows.shelves.code',
        shelf_name: '$rooms.rows.shelves.name',
        tray_id: '$trays._id',
        tray_code: '$trays.code',
        tray_capacity: '$trays.capacity',
        tray_capacity_type: '$trays.capacity_type',
      }},
    ]

    result.to_a
  end
end
