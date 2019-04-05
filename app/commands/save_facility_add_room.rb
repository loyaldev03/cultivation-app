class SaveFacilityAddRoom
  prepend SimpleCommand

  attr_reader :facility_id, :room_info_form

  def initialize(facility_id, room_info_form)
    @facility_id = facility_id
    @room_info_form = room_info_form
  end

  def call
    facility.rooms ||= []
    facility.rooms << build_room
    facility.save!
    facility
  end

  private

  def facility
    @facility ||= Facility.find(facility_id)
  end

  def build_room
    Room.new(
      id: room_info_form.id,
      code: room_info_form.code,
      full_code: Constants.generate_full_code(facility, room_info_form),
      name: room_info_form.name,
    )
  end
end
