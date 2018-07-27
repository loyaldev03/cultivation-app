class SaveFacilityWizardRooms
  prepend SimpleCommand

  def initialize(facility_id, rooms_form, replace = false)
    @facility_id = facility_id
    @rooms_form = rooms_form
    @replace = replace
  end

  def call
    save_record(@facility_id, @rooms_form, @replace)
  end

  private

  # Note: Save wizard generated rooms to facility
  def save_record(facility_id, rooms_form, replace)
    facility = Facility.find(facility_id)
    facility.rooms ||= []
    if replace
      facility.rooms = Array.new(rooms_form.size) do |i|
        build_room(rooms_form[i])
      end
    else
      facility.rooms << Array.new(rooms_form.size) do |i|
        build_room(rooms_form[i])
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
