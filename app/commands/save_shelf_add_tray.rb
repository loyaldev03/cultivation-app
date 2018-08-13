class SaveShelfAddTray
  prepend SimpleCommand

  def initialize(
                 facility_id,
                 room_id,
                 row_id,
                 shelf_id)
    @facility_id = facility_id
    @room_id = room_id
    @row_id = row_id
    @shelf_id = shelf_id
  end

  def call
    save_record
  end

  private

  def save_record
    facility = Facility.find(@facility_id)
    room = facility.rooms.find(@room_id)
    row = room.rows.find(@row_id)
    shelf = row.shelves.find(@shelf_id)
    shelf.is_use_trays = true
    shelf.save!

    if shelf.trays.blank?
      last_code = Sequence.tray_code_format % 0
    else
      last_code = shelf.trays&.last&.code
    end

    tray = Tray.new
    tray.shelf = shelf
    tray.code = NextFacilityCode.call(:tray, last_code, 1).result
    tray.save!
    tray
  end
end
