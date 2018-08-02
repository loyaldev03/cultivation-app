module FacilityWizardForm
  class TrayInfoForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :row_id,
             :shelf_id,
             :id,
             :capacity,
             :capacity_type,
             :code]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, row_id, shelf_id, tray_model = {})
      self.map_attrs_from_hash(ATTRS, tray_model)
      self.facility_id = facility_id
      self.room_id = room_id
      self.row_id = row_id
      self.shelf_id = shelf_id
      self.id = self.id.to_s unless self.id.nil?
    end
  end
end
