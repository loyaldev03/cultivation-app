class SaveFacilityRoomCount
  prepend SimpleCommand

  def initialize(facility_id, room_count)
    @facility_id = facility_id
    @room_count = room_count
  end

  def call
    save_record(@facility_id, @room_count)
  end

  private

  def save_record(facility_id, room_count)
    record = Facility.find(facility_id)
    record.wz_room_count = room_count
    record.save!
    record
  end
end
