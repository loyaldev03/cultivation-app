module FacilityWizardForm
  class SectionInfoForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id,
             :name,
             :code,
             :purpose,
             :purpose_option]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, section_model = {})
      self.map_attrs_from_hash(ATTRS, section_model)
      self.facility_id = facility_id
      self.room_id = room_id
    end

    class << self
      def new_by_id(facility_id, room_id, section_id, section_name, section_code)
        raise ArgumentError, 'Invalid facility_id' if facility_id.nil?
        raise ArgumentError, 'Invalid room_id' if room_id.nil?
        raise ArgumentError, 'Invalid section_id' if section_id.nil?

        find_cmd = FindFacility.call({id: facility_id})
        if find_cmd.success?
          facility = find_cmd.result
          room = facility.rooms.detect { |r| r.id == room_id.to_bson_id }
          section = room.sections.detect { |s| s.id == section_id.to_bson_id }
          section_info = SectionInfoForm.new(facility_id, room_id, section)
        else
          raise ArgumentError, 'Invalid Record'
        end
      end
    end
  end
end
