class SaveRow
  prepend SimpleCommand

  # NOTE: This method is called when user save the basic row info
  # @form_object = UpdateRowInfoForm
  def initialize(form_object)
    @form_object = form_object
  end

  def call
    save_record(@form_object)
  end

  private

  def save_record(form_object)
    facility = get_facility(form_object.facility_id)
    room = facility.rooms.detect { |r| r.id.to_s == form_object.room_id }
    row = room.rows.detect { |o| o.id.to_s == form_object.id }
    if row.nil?
      row = room.rows.build(id: form_object.id)
    end

    # mappings
    row.name = form_object.name
    row.code = form_object.code
    row.has_shelves = form_object.has_shelves
    row.has_trays = form_object.has_trays
    row.wz_shelves_count = row.has_shelves ? form_object.wz_shelves_count : 1
    row.wz_trays_count = row.has_trays ? form_object.wz_trays_count : 0
    room.save!
    row
  end

  def get_facility(facility_id)
    raise ArgumentError, 'Invalid RowId' if facility_id.nil?
    find_cmd = FindFacility.call({id: facility_id})
    if find_cmd.success?
      find_cmd.result
    else
      raise ArgumentError, 'Invalid Facility'
      nil
    end
  end
end
