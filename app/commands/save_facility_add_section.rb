class SaveFacilityAddSection
  prepend SimpleCommand

  def initialize(facility_id, room_id)
    @facility_id = facility_id
    @room_id = room_id
  end

  def call
    save_record
  end

  private

  def save_record
    facility = Facility.find(@facility_id)
    room = facility.rooms.find(@room_id)
    room.sections ||= []
    if room.sections.blank?
      last_section_code = Sequence.section_code_format % 0
    else
      last_section_code = room.sections&.last&.code
      last_section_name = room.sections&.last&.name
    end
    last_section_name ||= "Section #{room.sections&.size || 0}"
    section = room.sections.build(
      name: last_section_name.next,
      code: last_section_code.next
    )
    room.has_sections = true
    room.save!
    section
  end
end
