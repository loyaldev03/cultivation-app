class FindRow
  prepend SimpleCommand

  def initialize(facility_id, room_id, row_id)
    @facility_id = facility_id
    @room_id = room_id
    @row_id = row_id
  end

  def call
    query_record
  end

  private

  def query_record
    facility = Facility.find(@facility_id)
    room = facility.rooms.detect { |r| r.id == @room_id.to_bson_id }
    row = room.rows.detect { |o| o.id == @row_id.to_bson_id }
  end
end
