module FacilityWizardForm
  class RowInfoForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id,
             :code,
             :name,
             :section_id,
             :has_shelves,
             :has_trays,
             :capacity,
             :capacity_text,
             :wz_shelves_count,
             :wz_trays_count]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id, row_model = {})
      self.map_attrs_from_hash(ATTRS, row_model)
      if row_model.try(:shelves)
        calculate_capacity(row_model.shelves)
      else
        self.capacity_text = "--"
      end
      self.facility_id = facility_id
      self.room_id = room_id
    end

    def shelves_count_text
      if self.has_shelves && self.wz_shelves_count > 0
        self.wz_shelves_count
      else
        'N/A'
      end
    end

    def trays_count_text
      if self.has_trays && self.wz_trays_count > 0
        self.wz_trays_count
      else
        'N/A'
      end
    end

    def calculate_capacity(shelves)
      if shelves.blank?
        self.capacity = 0
        self.capacity_text = "--"
      else
        self.capacity = shelves.sum {|h| h[:capacity]}
        self.capacity_text = self.capacity
      end
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
            code: row_code,
          })
        else
          row_info = RowInfoForm.new(facility_id, room.id.to_s, row)
        end
      end
    end
  end
end
