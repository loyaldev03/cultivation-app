class QueryLocations
  prepend SimpleCommand

  attr_reader :facility_id, :purposes

  def initialize(facility_id, purposes = [])
    @facility_id = facility_id&.to_bson_id
    @purposes = purposes
  end

  def call
    criteria = Facility.collection.aggregate [
      {"$match": {_id: facility_id}},
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
        "row_purpose": {"$ifNull": ['$section.section_purpose', '$rooms.purpose']},
      }},
      match_purposes,
      {"$lookup": {
        from: 'trays',
        localField: 'rooms.rows.shelves._id',
        foreignField: 'shelf_id',
        as: 'trays',
      }},
      {"$unwind": {path: '$trays'}},
      {"$match": {
        "$or": [
          {"trays.capacity": {"$ne": nil}}, {"trays": {"$eq": nil}},
        ],
      }},
      {"$project": {
        facility_id: '$facility_id',
        facility_code: 1,
        facility_name: 1,
        room_id: '$rooms._id',
        room_is_complete: '$rooms.is_complete',
        room_name: '$rooms.name',
        room_code: '$rooms.code',
        room_full_code: '$rooms.full_code',
        room_has_sections: '$rooms.has_sections',
        row_id: '$rooms.rows._id',
        row_name: '$rooms.rows.name',
        row_code: '$rooms.rows.code',
        row_full_code: '$rooms.rows.full_code',
        row_has_shelves: '$rooms.rows.has_shelves',
        row_has_trays: '$rooms.rows.has_trays',
        section_id: '$section.section_id',
        section_name: '$section.section_name',
        section_code: '$section.section_code',
        section_full_code: '$section.section_full_code',
        shelf_id: '$rooms.rows.shelves._id',
        shelf_code: '$rooms.rows.shelves.code',
        shelf_full_code: '$rooms.rows.shelves.full_code',
        shelf_name: '$rooms.rows.shelves.name',
        shelf_capacity: '$rooms.rows.shelves.capacity',
        tray_id: '$trays._id',
        tray_code: '$trays.code',
        tray_full_code: '$trays.full_code',
        tray_capacity: '$trays.capacity',
        row_purpose: 1,
      }},
    ]
    criteria.to_a
  end

  private

  def match_purposes
    if purposes.blank?
      {"$match": {}}
    elsif purposes.is_a?(Array)
      {"$match": {row_purpose: {'$in': purposes}}}
    else
      {"$match": {row_purpose: purposes}}
    end
  end

  LocationOption = Struct.new(:label, :value)

  class << self
    def select_options(facility_id, purposes)
      locations = QueryLocations.call(facility_id, purposes).result
      locations.map do |loc|
        LocationOption.new(loc[:tray_full_code], loc[:tray_id].to_s)
      end
    end
  end
end
