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

  # Note: Save wizard generated rooms to facility
  def save_record(facility_id, room_id, form_rows, replace = false)
    facility = Facility.find(facility_id)
    raise ArgumentError, 'Invalid Facility' if facility.nil?
    room = facility.rooms.detect { |r| r.id.to_s == room_id }
    raise ArgumentError, 'Invalid Room' if room.nil?
    room.rows ||= []

    if replace
      room.rows = Array.new(form_rows.size) do |i|
        build_row(form_rows[i])
      end
    else
      room.rows << Array.new(form_rows.size) do |i|
        build_row(form_rows[i])
      end
    end
    room.save!
    room
  end

  def build_row(row_info_form)
    Row.new(
      id: row_info_form.id,
      code: row_info_form.code,
      name: row_info_form.name,
    )
  end
end