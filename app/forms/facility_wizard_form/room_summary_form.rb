module FacilityWizardForm
  class RoomSummaryForm
    include Mapper

    ATTRS = [:facility_id, :room_id, :has_sections, :purpose]

    attr_accessor(*ATTRS)

    def initialize(params = {})
      self.map_attrs_from_hash(ATTRS, params)
      set_record
    end

    private

    def set_record
      facility = FindFacility.call(id: facility_id).result
      if room_id.present?
        room = facility.rooms.find(room_id)
        self.has_sections = room.has_sections
        self.purpose = room.purpose
      end
    end
  end
end
