class SaveFacilityWizardRows
  prepend SimpleCommand

  def initialize(facility_id, room_id, form_rows, replace = false)
    @facility_id = facility_id
    @room_id = room_id
    @form_rows = form_rows
    @replace = replace
  end

  def call
    save_record(@facility_id, @room_id, @form_rows, @replace)
  end

  private

  # NOTE: Save wizard generated rooms to facility
  def save_record(facility_id, room_id, form_rows, replace = false)
    facility = Facility.find(facility_id)
    raise ArgumentError, 'Invalid Facility' if facility.nil?
    room = facility.rooms.detect { |r| r.id.to_s == room_id }
    raise ArgumentError, 'Invalid Room' if room.nil?
    room.rows ||= []

    if replace
      room.rows = Array.new(form_rows.size) do |i|
        build_row(facility, room, form_rows[i])
      end
    else
      room.rows << Array.new(form_rows.size) do |i|
        build_row(facility, room, form_rows[i])
      end
    end
    SaveRoomIsComplete.call(room) # This would called `save!` already
    room
  end

  def build_row(facility, room, row_info_form)
    row = Row.new(
      id: row_info_form.id,
      code: row_info_form.code,
      name: row_info_form.name,
      section_id: row_info_form.section_id.to_bson_id,
    )
    row.full_code = Constants.generate_full_code(facility, room, row)
    row
  end
end
