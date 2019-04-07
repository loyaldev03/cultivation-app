class SaveFacilityWizardRooms
  prepend SimpleCommand

  attr_reader :facility_id, :form_rooms, :replace

  def initialize(facility_id, form_rooms, replace = false)
    @facility_id = facility_id
    @form_rooms = form_rooms
    @replace = replace
  end

  def call
    raise ArgumentError, 'Invalid Facility' if facility.nil?
    facility.rooms ||= []
    # Note: Save wizard generated rooms to facility
    if replace
      facility.rooms = Array.new(form_rooms.size) do |i|
        build_room(form_rooms[i])
      end
    else
      facility.rooms << Array.new(form_rooms.size) do |i|
        build_room(form_rooms[i])
      end
    end
    facility.save!
    facility
  end

  private

  def facility
    @facility ||= Facility.find(facility_id)
  end

  def build_room(room_info_form)
    Room.new(
      id: room_info_form.id,
      code: room_info_form.code,
      full_code: Constants.generate_full_code(facility, room_info_form),
      name: room_info_form.name,
    )
  end
end
