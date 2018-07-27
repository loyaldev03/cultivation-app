class SaveFacilityWizardRooms
  prepend SimpleCommand

  def initialize(facility_id, form_rooms, replace = false)
    @facility_id = facility_id
    @form_rooms = form_rooms
    @replace = replace
  end

  def call
    save_record(@facility_id, @form_rooms, @replace)
  end

  private

  # Note: Save wizard generated rooms to facility
  def save_record(facility_id, form_rooms, replace = false)
    facility = Facility.find(facility_id)
    raise ArgumentError, 'Invalid Facility' if facility.nil?
    facility.rooms ||= []

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

  def build_room(room_info_form)
    Room.new(
      id: room_info_form.id,
      code: room_info_form.code,
      name: room_info_form.name,
    )
  end
end
