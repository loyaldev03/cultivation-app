class SaveRowShelvesTrays
  prepend SimpleCommand

  # NOTE:
  # - This method is called when user proceed to configure row details
  # - Generate the shelves & trays based on row record data
  # @form_object = UpdateRowInfoForm
  def initialize(form_object)
    @form_object = form_object
  end

  def call
    save_record(@form_object)
  end

  private

  def save_record(form_object)
    facility = Facility.find(form_object.facility_id)
    room = facility.rooms.detect { |r| r.id.to_s == form_object.room_id }
    row = room.rows.detect { |o| o.id.to_s == form_object.id }

    if row.wz_generated
      # NOTE: Generate shelves & trays if record is wizard generated,
      # so we only generate this once.
      generate_shelves(facility, room, row)
    end

    trays_count = trays_count(row)
    # Rails.logger.debug ">>> trays_count #{trays_count}"

    if trays_count == 0
      # NOTE: Generate a single tray into the first shelf if nothing
      # has been defined previously
      generate_trays(facility, room, row, row.shelves.first, 1)
    end

    # Marked this record as altered by user.
    # We can use this flag to hide the "How many shelves / trays" questions.
    row.wz_generated = false
    row.save!
  end

  def generate_shelves(facility, room, row)
    s_count = row.wz_shelves_count
    s_count ||= 1 # Default to 1 Shelf if undefined
    t_count = row.wz_trays_count
    t_count ||= 1 # Default to single Tray if undefined
    row.shelves = Array.new(s_count) do |i|
      shelf = row.shelves.build
      shelf.code = NextFacilityCode.call(:shelf, nil, i + 1).result
      shelf.full_code = Constants.generate_full_code(facility, room, row, shelf)
      generate_trays(facility, room, row, shelf, t_count)
      shelf
    end
  end

  def generate_trays(facility, room, row, shelf, count)
    shelf.trays = Array.new(count) do |i|
      tray = shelf.trays.build
      tray.code = NextFacilityCode.call(:tray, nil, i + 1).result
      tray.full_code = Constants.generate_full_code(facility, room, row, shelf, tray)
      tray.save!
      tray
    end
  end

  def trays_count(row)
    if row.shelves.blank?
      0
    else
      row.shelves.reduce(0) { |sum, shelf| sum + (shelf.trays.blank? ? 0 : shelf.trays.size) }
    end
  end
end
