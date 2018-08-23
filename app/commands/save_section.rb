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
    facility.save!
    section
  end
end
