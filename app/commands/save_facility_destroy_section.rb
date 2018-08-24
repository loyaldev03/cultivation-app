class SaveFacilityDestroySection
  prepend SimpleCommand

  def initialize(facility_id, room_id, section_id)
    @facility_id = facility_id
    @room_id = room_id
    @section_id = section_id
  end

  def call
    save_record
  end

  private

  def save_record
    facility = Facility.find(@facility_id)
    room = facility.rooms.find(@room_id)
    section = room.sections.find(@section_id)
    room.sections.delete(section)
    SaveRoomIsComplete.call(room)
    room
  end
end
