class QueryFacilitySummary
  prepend SimpleCommand

  #attr_reader :facility_id

  def initialize(current_user, args = {})
    @user = current_user

    raise ArgumentError, 'facility_ids' if args[:facility_ids].blank?
    raise ArgumentError, 'facility_ids' unless (args[:facility_ids].is_a? Array)

    @facility_ids = args[:facility_ids]
  end

  def call
    trays = QueryAvailableTrays.call(facility_ids: @facility_ids,
                                     start_date: Time.current.beginning_of_day,
                                     end_date: Time.current.end_of_day).result

    trays_by_room = trays.group_by(&:room_code)
    results = trays_by_room.keys.map do |room_code|
      get_room_summary(trays_by_room[room_code])
    end

    order = Constants::FACILITY_ROOMS_ORDER
    results = results.select { |h| h[:purpose].present? }.sort_by do |r|
      order_i = if r[:purpose].blank?
                  results.size
                else
                  order.index { |s| r[:purpose].downcase.ends_with?(s) }
                end
      [order_i, r[:room_code]]
    end
  end

  def get_room_summary(trays)
    room_info = trays[0]
    total_capacity = 0
    planned_capacity = 0
    available_capacity = 0
    section_ids = {}
    row_ids = {}
    shelves_ids = {}

    # Single loop to sum up 3 fields
    trays.each do |t|
      total_capacity += t.tray_capacity || 0
      planned_capacity += t.planned_capacity || 0
      available_capacity += t.remaining_capacity || 0
      section_ids[t.section_id] = t.section_id if t.section_id
      row_ids[t.row_id] = t.row_id if t.row_id
      shelves_ids[t.shelf_id] = t.shelf_id if t.shelf_id
    end

    # Results
    {
      room_id: room_info.room_id,
      room_name: room_info.room_name,
      room_code: room_info.room_code,
      purpose: room_info.room_purpose,
      facility_id: room_info.facility_id,
      facility_name: room_info.facility_name,
      room_has_sections: room_info.room_has_sections,
      total_capacity: total_capacity,
      planned_capacity: planned_capacity,
      available_capacity: available_capacity,
      section_count: section_ids.keys.size,
      row_count: row_ids.keys.size,
      shelf_count: shelves_ids.keys.size,
      tray_count: trays.size,
    }
  end
end
