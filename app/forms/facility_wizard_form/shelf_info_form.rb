module FacilityWizardForm
  class ShelfInfoForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :row_id,
             :id,
             :code,
             :capacity,
             :is_use_trays]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, row_id, shelf_model = {})
      self.map_attrs_from_hash(ATTRS, shelf_model)
      self.facility_id = facility_id
      self.room_id = room_id
      self.row_id = row_id
    end
  end
end
