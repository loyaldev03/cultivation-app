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
      find_cmd = FindFacility.call({id: self.facility_id})
      facility = find_cmd.result
      room = facility.rooms.find(self.room_id)
      self.has_sections = room.has_sections
      self.purpose = room.purpose
    end
  end
end
