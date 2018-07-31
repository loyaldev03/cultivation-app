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
      generate_shelves(row)
    end

    # Marked this record as altered by user.
    # We can use this flag to hide the "How many shelves / trays" questions.
    row.wz_generated = false
    row.save!
  end

  def generate_shelves(row)
    s_count = row.wz_shelves_count
    t_count = row.wz_trays_count
    row.shelves = Array.new(s_count) do |i|
      shelf = row.shelves.build
      shelf.code = NextFacilityCode.call(:shelf, nil, i + 1).result
      generate_trays(shelf, t_count)
      shelf
    end
  end

  def generate_trays(shelf, count)
    shelf.trays = Array.new(count) do |i|
      tray = shelf.trays.build
      tray.code = NextFacilityCode.call(:tray, nil, i + 1).result
      tray.save!
      tray
    end
  end
end
