class SaveRoom
  prepend SimpleCommand

  # Update Room info
  # form_object: UpdateRoomInfoForm
  def initialize(form_object)
    @form_object = form_object
  end

  def call
    save_record(@form_object)
  end

  private

  def save_record(form_object)
    raise ArgumentError, 'Invalid RoomId' if form_object.id.nil?
    facility = get_facility(form_object.facility_id)
    facility.rooms ||= []
    room = facility.rooms.detect { |r| r.id.to_s == form_object.id }
    if room.nil?
      room = facility.rooms.build(id: form_object.id)
    end
    room.name = form_object.name
    room.code = form_object.code
    room.desc = form_object.desc
    room.purpose = form_object.purpose
    room.has_sections = form_object.has_sections
    room.wz_generated = false
    facility.save!
    room
  end

  def get_facility(facility_id)
    find_cmd = FindFacility.call({id: facility_id})
    if find_cmd.success?
      find_cmd.result
    else
      raise ArgumentError, 'Invalid Facility'
      nil
    end
  end
end
