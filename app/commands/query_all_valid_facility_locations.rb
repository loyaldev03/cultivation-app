class QueryAllValidFacilityLocations
  prepend SimpleCommand

  attr_reader :storage_types

  def initialize(*storage_types)
    @storage_types = storage_types || []
  end

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
        next unless valid_room? room

        add_room(room_list, facility, room)
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

    facility_list.
      concat(room_list).
      concat(section_list).
      concat(row_list).
      concat(shelf_list).
      concat(tray_list)
  end

  private

  def valid_room?(room)
    return false if !room.is_complete             # Do not return incomplete rooms
    return true if @storage_types.empty?         # Return all rooms if no filter provided
    return @storage_types.include? room.purpose   # Returns only the room that match the purpose
  end

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
    item = {
      f_id: facility.id.to_s,
      f_name: facility.name,
      f_code: facility.code,

      rm_id: room ? room.id.to_s : '',
      rm_name: room ? room.name : '',
      rm_code: room ? room.code : '',
      rm_purpose: room ? room.purpose : '',

      s_id: section ? section.id.to_s : '',
      s_name: section ? section.name : '',
      s_code: section ? section.code : '',

      rw_id: row ? row.id.to_s : '',
      rw_name: row ? row.name : '',
      rw_code: row ? row.code : '',

      sf_id: shelf ? shelf.id.to_s : '',
      sf_code: shelf ? shelf.code : '',

      t_id: tray ? tray.id.to_s : '',
      t_code: tray ? tray.code : '',
      t_capacity: tray ? tray.capacity : 0,
      t_purpose: '',
    }

    search = [facility.code]
    search.push room.code if room
    search.push section.code if section
    search.push row.code if row
    search.push shelf.code if shelf
    search.push tray.code if tray
    search_string = search.join('.')

    item.merge!({value: search_string, label: search_string})
  end
end
