class SaveFacilityDestroyRoom
  prepend SimpleCommand

  def initialize(facility_id, room_id)
    @facility_id = facility_id
    @room_id = room_id
  end

  def call
    save_record(@facility_id, @room_id)
  end

  private

  def save_record(facility_id, room_id)
    facility = Facility.find(facility_id)
    room = facility.rooms.find(room_id)
    facility.rooms.delete(room)
  end
end
