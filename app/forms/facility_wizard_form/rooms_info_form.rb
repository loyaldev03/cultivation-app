module FacilityWizardForm
  class RoomInfo
    ATTRS = [:id,
             :facility_id,
             :name,
             :code,
             :desc,
             :purpose,
             :capacity,
             :rows_count,
             :sections_count,
             :shelves_count]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_model = {})
      self.facility_id = facility_id
      map_model_to_form(room_model)
    end

    class << self
      def new_by_id(facility_id, room_id, room_name, room_code)
        raise ArgumentError, "Invalid facility_id" if facility_id.nil?
        raise ArgumentError, "Invalid room_id" if room_id.nil?
        find_cmd = FindFacility.call({id: facility_id})
        if find_cmd.success?
          facility = find_cmd.result
          room = facility.rooms.detect { |r| r.id.to_s == room_id }
          if room.nil?
            room_info = RoomInfo.new(facility_id, {
              id: room_id,
              name: room_name,
              code: room_code,
            })
          else
            room_info = RoomInfo.new(facility_id, room)
            room_info
          end
        else
          raise ArgumentError, "Invalid Record"
        end
      end
    end

    private

    def map_model_to_form(room_model)
      self.id = room_model[:id]
      self.name = room_model[:name]
      self.code = room_model[:code]
      self.desc = room_model[:desc]
    end
  end

  class RoomsInfoForm
    attr_reader :facility_id
    attr_reader :facility
    attr_accessor :rooms

    def initialize(facility_id)
      @facility_id = facility_id
      @rooms = []
      set_record(facility_id)
    end

    def set_rooms_from_count(rooms_count = 0)
      if self.rooms.blank?
        self.rooms = Array.new(rooms_count) do |i|
          RoomInfo.new(@facility_id, {
            id: BSON::ObjectId.new,
            code: "RM#{i+1}",
            name: "Room #{i+1}"
          })
        end
      else
        if rooms_count <= self.rooms.size
          self.rooms = self.rooms.first(rooms_count)
        else
          missing_count = rooms_count - self.rooms.size
          last_code = self.rooms.last.code
          missing_rooms = Array.new(missing_count) do |i|
            next_count = i + 1
            room_code = NextFacilityCode.call(:room, last_code, next_count).result
            room_name = "Room #{self.rooms.size + next_count}"
            RoomInfo.new(@facility_id, {
              id: BSON::ObjectId.new,
              code: room_code, name: room_name
            })
          end
          self.rooms.concat(missing_rooms)
        end
      end
    end

    private

    def set_record(facility_id)
      raise ArgumentError, "Invalid Facility" if facility_id.nil?
      find_cmd = FindFacility.call({id: facility_id})
      if find_cmd.success?
        facility = find_cmd.result
        unless facility.rooms.blank?
          self.rooms = facility.rooms.map do |room|
            RoomInfo.new(@facility_id, room)
          end
        end
      end
    end
  end
end
