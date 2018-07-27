class SaveFacilityAddRoom
  prepend SimpleCommand

  def initialize(facility_id, room_info_form)
    @facility_id = facility_id
    @room_info_form = room_info_form
  end

  def call
    save_record(@facility_id, @room_info_form)
  end

  private

  # Note: Save wizard generated rooms to facility
  def save_record(facility_id, room_info_form)
    facility = Facility.find(facility_id)
    facility.rooms ||= []
    facility.rooms << build_room(room_info_form)
    facility.save!
    facility
  end

  def build_room(room_info_form)
    Room.new(
      id: room_info_form.id,
      code: room_info_form.code,
      name: room_info_form.name,
    )
  end
end
