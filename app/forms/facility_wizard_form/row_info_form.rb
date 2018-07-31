module FacilityWizardForm
  class RowInfoForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id,
             :code,
             :name,
             :has_shelves,
             :has_trays,
             :wz_shelves_count,
             :wz_trays_count]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, row_model = {})
      self.map_attrs_from_hash(ATTRS, row_model)
      self.facility_id = facility_id
      self.room_id = room_id
    end

    class << self
      def new_by_id(facility_id, room_id, row_id, row_name, row_code)
        facility = RowInfoForm.get_facility(facility_id)
        room = RowInfoForm.get_room(facility, room_id)
        row = RowInfoForm.get_row(facility_id, room, row_id, row_name, row_code)
        row
      end
    end


    class << self
      def get_facility(facility_id)
        raise ArgumentError, 'Invalid facility_id' if facility_id.nil?
        find_cmd = FindFacility.call({id: facility_id})
        if find_cmd.success?
          return find_cmd.result
        else
          raise ArgumentError, 'Facility record not found'
          return nil
        end
      end

      def get_room(facility, room_id)
        raise ArgumentError, 'Invalid room_id' if room_id.nil?
        room = facility.rooms.detect { |r| r.id.to_s == room_id }
        if room.nil?
          raise ArgumentError, 'Room record not found'
          return nil
        end
        room
      end

      def get_row(facility_id, room, row_id, row_name, row_code)
        raise ArgumentError, 'Invalid row_id' if row_id.nil?
        row = room.rows.detect { |o| o.id.to_s == row_id }
        if row.nil?
          row_info = RowInfoForm.new(facility_id, room.id.to_s, {
            id: row_id,
            name: row_name,
            code: row_code
          })
        else
          row_info = RowInfoForm.new(facility_id, room.id.to_s, row)
        end
      end
    end
  end
end
