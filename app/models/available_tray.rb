class AvailableTray
  attr_reader :facility_id,
              :facility_code,
              :facility_name,
              :room_id,
              :room_is_complete,
              :room_name,
              :room_code,
              :room_purpose,
              :room_has_sections,
              :row_id,
              :row_name,
              :row_code,
              :row_has_shelves,
              :row_has_trays,
              :section_id,
              :section_name,
              :section_code,
              :section_purpose,
              :shelf_id,
              :shelf_code,
              :shelf_name,
              :shelf_capacity,
              :tray_id,
              :tray_code,
              :tray_capacity,
              :tray_capacity_type,
              :tray_purpose,
              :planned_capacity,
              :remaining_capacity

  def initialize(args)
    @facility_id = args[:facility_id].to_s
    @facility_code = args[:facility_code]
    @facility_name = args[:facility_name]
    @room_id = args[:room_id].to_s
    @room_is_complete = args[:room_is_complete]
    @room_name = args[:room_name]
    @room_code = args[:room_code]
    @room_purpose = args[:room_purpose]
    @room_has_sections = args[:room_has_sections]
    @row_id = args[:row_id].to_s
    @row_name = args[:row_name]
    @row_code = args[:row_code]
    @row_has_shelves = args[:row_has_shelves]
    @row_has_trays = args[:row_has_trays]
    @section_id = args[:section_id].to_s
    @section_name = args[:section_name]
    @section_code = args[:section_code]
    @section_purpose = args[:section_purpose]
    @shelf_id = args[:shelf_id].to_s
    @shelf_code = args[:shelf_code]
    @shelf_name = args[:shelf_name]
    @shelf_capacity = args[:shelf_capacity]
    @tray_id = args[:tray_id].to_s
    @tray_code = args[:tray_code]
    @tray_capacity = args[:tray_capacity]
    @tray_capacity_type = args[:tray_capacity_type]
    @tray_purpose = args[:tray_purpose]
    @planned_capacity = args[:planned_capacity]
    @remaining_capacity = args[:remaining_capacity]
  end
end
