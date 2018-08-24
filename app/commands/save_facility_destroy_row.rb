class SaveFacilityDestroyRow
  prepend SimpleCommand

  def initialize(facility_id, room_id, row_id)
    @facility_id = facility_id
    @room_id = room_id
    @row_id = row_id
  end

  def call
    save_record(@facility_id, @room_id, @row_id)
  end

  private

  def save_record(facility_id, room_id, row_id)
    facility = Facility.find(facility_id)
    room = facility.rooms.find(room_id)
    row = room.rows.find(row_id)
    # TODO: delete all shelves & tray under row?
    # or run cleanup job to remove orphan record
    room.rows.delete(row)
    # Update is_complete flag for room
    SaveRoomIsComplete.call(room)
    room
  end
end
