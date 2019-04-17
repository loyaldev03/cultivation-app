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
    room.full_code = Constants.generate_full_code(facility, room)
    room.desc = form_object.desc
    room.purpose = form_object.purpose
    room.has_sections = form_object.has_sections
    if room.has_sections && room.sections.blank?
      new_code = NextFacilityCode.call(:section, nil, 1).result
      room.sections.build(code: new_code, purpose: room.purpose)
    end

    if room.purpose == 'trim' || room.purpose == 'storage'
      # Mark room as complete since there's no setup requrired
      # for Trim and Storage room
      room.is_complete = true
    end

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
