module FacilityWizardForm
  class RowInfoForm
    ATTRS = [:id,
             :code,
             :name,
             :facility_id,
             :room_id]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, row_model = {})
      self.map_attrs_from_hash(ATTRS, room_model)
      self.facility_id = facility_id
      self.room_id = room_id
    end
  end
end
