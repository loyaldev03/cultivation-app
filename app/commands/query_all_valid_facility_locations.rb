class QueryAllValidFacilityLocations
  prepend SimpleCommand

  def call
    facility_list = []
    room_list = []
    section_list = []
    row_list = []
    shelf_list = []
    tray_list = []

    Facility.completed.each do |facility|
      add_facility(facility_list, facility)

      facility.rooms.each do |room|
        add_room(room_list, facility, room)

        if room.is_complete
          add_sections(section_list, facility, room)
          add_rows(row_list, facility, room, room.rows)

          room.rows.each do |row|
            add_shelves(shelf_list, facility, room, row, row.shelves)

            row.shelves.each do |shelf|
              add_trays(tray_list, facility, room, row, shelf, shelf.trays)
            end
          end
        end
      end
    end

    facility_list.
      concat(room_list).
      concat(section_list).
      concat(row_list).
      concat(shelf_list).
      concat(tray_list)
  end

  private

  def add_facility(collection, facility)
    item = transform(facility)
    collection.push(item)
  end

  def add_room(collection, facility, room)
    if room.is_complete
      item = transform(facility, room)
      collection.push(item)
    end
  end

  def add_sections(collection, facility, room)
    room.sections.each do |section|
      item = transform(facility, room, section)
      collection.push(item)
    end
  end

  def add_rows(collection, facility, room, rows)
    rows.each do |row|
      if row.is_complete
        section = get_section(row)
        item = transform(facility, room, section, row)
        collection.push(item)
      end
    end
  end

  def add_shelves(collection, facility, room, row, shelves)
    section = get_section(row)
    shelves.each do |shelf|
      item = transform(facility, room, section, row, shelf)
      collection.push(item)
    end
  end

  def add_trays(collection, facility, room, row, shelf, trays)
    section = get_section(row)
    trays.each do |tray|
      item = transform(facility, room, section, row, shelf, tray)
      collection.push(item)
    end
  end

  def get_section(row)
    row.section_id ? row.room.sections.find(row.section_id) : nil
  end

  def transform(facility, room = nil, section = nil, row = nil, shelf = nil, tray = nil)
    # item = {
    #   facility_id:   facility.id.to_s,
    #   facility_name: facility.name,
    #   facility_code: facility.code,

    #   room_id:      room ? room.id.to_s : '',
    #   room_name:    room ? room.name : '',
    #   room_code:    room ? room.code : '',
    #   room_purpose: room ? room.purpose : '',

    #   section_id:   section ? section.id.to_s : '',
    #   section_name: section ? section.name : '',
    #   section_code: section ? section.code : '',

    #   row_id:       row ? row.id.to_s : '',
    #   row_name:     row ? row.name : '',
    #   row_code:     row ? row.code : '',

    #   shelf_id:     shelf ? shelf.id.to_s : '',
    #   shelf_code:   shelf ? shelf.code : '',

    #   tray_id:      tray ? tray.id.to_s : '',
    #   tray_code:    tray ? tray.code : '',
    #   tray_purpose: '',
    #   tray_cap: 0
    # }

    item = {
      fid: facility.id.to_s,
      fn: facility.name,
      fc: facility.code,

      rmid: room ? room.id.to_s : '',
      rmn: room ? room.name : '',
      rmc: room ? room.code : '',
      rmp: room ? room.purpose : '',

      sid: section ? section.id.to_s : '',
      sn: section ? section.name : '',
      sc: section ? section.code : '',

      rwid: row ? row.id.to_s : '',
      rwn: row ? row.name : '',
      rwc: row ? row.code : '',

      sfid: shelf ? shelf.id.to_s : '',
      sfc: shelf ? shelf.code : '',

      tid: tray ? tray.id.to_s : '',
      tc: tray ? tray.code : '',
      cap: tray ? tray.capacity : 0,
      tp: '',
    }

    search = [facility.code]
    search.push room.code if room
    search.push section.code if section
    search.push row.code if row
    search.push shelf.code if shelf
    search.push tray.code if tray

    item.merge!({search: search.join('.')})
  end
end
