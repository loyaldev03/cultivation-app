module Cultivation
  class TrayResult
    include ActiveModel::Model

    ATTRS = [:facility_id,
             :facility_code,
             :facility_name,
             :room_id,
             :room_is_complete,
             :room_name,
             :room_code,
             :room_purpose,
             :row_id,
             :row_name,
             :row_code,
             :section_id,
             :section_name,
             :shelf_id,
             :shelf_code,
             :shelf_name,
             :tray_id,
             :tray_code,
             :tray_capacity,
             :tray_capacity_type,
             :planned_capacity,
             :remaining_capacity]

    attr_accessor(*ATTRS)
  end
end
