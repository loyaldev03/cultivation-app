class QueryReadyTrays
  prepend SimpleCommand

  # NOTE: This query all the Trays in a Facility that are
  # ready to be use in cultivation

  attr_reader :facility_id

  def initialize(facility_id = nil)
    @facility_id = facility_id
  end

  def call
    query_records
  end

  private

  def match_facility
    if @facility_id
      {"$match": {_id: @facility_id.to_bson_id}}
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
      {"$lookup": {
        from: 'trays',
        localField: 'rooms.rows.shelves._id',
        foreignField: 'shelf_id',
        as: 'trays',
      }},
      {"$unwind": '$trays'},
      {"$match": {"trays.capacity": {"$ne": nil}}},
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
      }).marshal_dump
    end

    res
  end
end
