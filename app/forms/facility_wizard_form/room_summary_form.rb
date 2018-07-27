module FacilityWizardForm
  class RoomSummaryForm
    include Mapper

    ATTRS = [:facility_id, :room_id]

    attr_accessor(*ATTRS)

    def initialize(params = {})
      self.map_attrs_from_hash(ATTRS, params)
    end
  end
end
