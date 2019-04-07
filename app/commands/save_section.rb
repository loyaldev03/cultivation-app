class SaveSection
  prepend SimpleCommand

  def initialize(form_object)
    @form_object = form_object
  end

  def call
    save_record
  end

  private

  def save_record
    fo = @form_object
    raise ArgumentError, 'Invalid section_id' if fo.id.nil?

    facility = Facility.find(fo.facility_id)
    room = facility.rooms.detect { |r| r.id == fo.room_id.to_bson_id }
    section = room.sections.detect { |s| s.id == fo.id.to_bson_id }
    section.name = fo.name
    section.code = fo.code
    section.full_code = "#{facility.code}.#{room.code}.#{section.code}"
    section.purpose = fo.purpose
    section.purpose_option = fo.purpose_option
    section.rack_has_levels = fo.rack_has_levels
    section.rack_count = fo.rack_count
    room.purpose = get_room_purpose(room)
    facility.save!
    section
  end

  def get_room_purpose(room)
    purposes = room.sections.map(&:purpose)&.uniq
    if purposes.present?
      room.purpose = purposes.join(', ')
    end
  end
end
