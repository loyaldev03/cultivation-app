module FacilityWizardForm
  class RoomInfoForm
    include Mapper

    ATTRS = [:id,
             :facility_id,
             :name,
             :code,
             :desc,
             :is_complete,
             :purpose,
             :has_sections,
             :sections,
             :rows,
             :capacity,
             :capacity_text,
             :rows_count_text,
             :sections_count_text,
             :shelves_count_text,
             :trays_count_text]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_model = {})
      self.map_attrs_from_hash(ATTRS, room_model)
      self.facility_id = facility_id
      if room_model.try(:rows)
        set_rows(room_model.rows)
      else
        self.capacity_text = '--'
      end
    end

    def set_rows(model_rows)
      if model_rows.blank?
        self.rows = []
      else
        self.rows = model_rows.map do |row|
          RowInfoForm.new(self.facility_id, self.id, row)
        end
      end
      calculate_capacity(self.rows)
      calculate_sections
      calculate_rows(self.rows)
    end

    def calculate_capacity(rows)
      if rows.blank?
        self.capacity = 0
        self.capacity_text = '--'
      else
        self.capacity = rows.sum { |h| h.capacity }
        self.capacity_text = self.capacity
      end
    end

    #shelves.reduce(0) { |sum, shelf| sum + (shelf.trays.blank? ? 0 : shelf.trays.size) }
    
    def calculate_rows(rows)
      if rows.blank?
        self.rows_count_text = '--'
      else
        self.rows_count_text = rows.size
      end
    end

    def calculate_sections
      if !self.has_sections || self.sections.blank?
        self.sections_count_text = '--'
      else
        self.sections_count_text = self.sections.size
      end
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
          end
        else
          raise ArgumentError, 'Invalid Record'
        end
      end
    end
  end
end
