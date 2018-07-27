module FacilityWizardForm
  class RoomInfoForm
    ATTRS = [:id,
             :facility_id,
             :name,
             :code,
             :desc,
             :purpose,
             :has_sections,
             :capacity,
             :rows_count,
             :sections_count,
             :shelves_count]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_model = {})
      map_model_to_form(room_model)
      self.facility_id = facility_id
    end

    class << self
      def new_by_id(facility_id, room_id, room_name, room_code)
        raise ArgumentError, 'Invalid facility_id' if facility_id.nil?
        raise ArgumentError, 'Invalid room_id' if room_id.nil?
        find_cmd = FindFacility.call({id: facility_id})
        if find_cmd.success?
          facility = find_cmd.result
          room = facility.rooms.detect { |r| r.id.to_s == room_id }
          if room.nil?
            room_info = RoomInfoForm.new(facility_id, {
              id: room_id,
              name: room_name, # copy auto generated name 
              code: room_code, # copy auto generated code
            })
          else
            room_info = RoomInfoForm.new(facility_id, room)
            room_info
          end
        else
          raise ArgumentError, 'Invalid Record'
        end
      end
    end

    private

    def map_model_to_form(room_model)
      ATTRS.each do |key|
        self.send("#{key}=", room_model[key])
      end
    end
  end
end
