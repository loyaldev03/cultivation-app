module FacilityWizardForm
  class RoomsForm
    attr_accessor :facility_id, :facility, :rooms, :wz_room_count

    def initialize(facility_id)
      @facility_id = facility_id
      @rooms = []
      set_record(facility_id)
    end

    def set_rooms_from_count(rooms_count = 0)
      @wz_room_count = rooms_count
      if self.rooms.blank?
        self.rooms = Array.new(rooms_count) do |i|
          RoomInfoForm.new(@facility_id, {
            id: BSON::ObjectId.new,
            code: "RM#{i + 1}",
            name: "Room #{i + 1}",
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
            RoomInfoForm.new(@facility_id, {
              id: BSON::ObjectId.new,
              code: room_code, name: room_name,
            })
          end
          self.rooms.concat(missing_rooms)
        end
      end
    end

    private

    def set_record(facility_id)
      raise ArgumentError, 'Invalid Facility' if facility_id.nil?
      find_cmd = FindFacility.call({id: facility_id})
      if find_cmd.success?
        facility = find_cmd.result
        unless facility.rooms.blank?
          self.rooms = facility.rooms.map do |room|
            RoomInfoForm.new(@facility_id, room)
          end
        end

        # if facility.rooms is empty just set to empty array
        self.rooms ||= []
        self.wz_room_count = facility.wz_room_count || 0

        # handle unsaved wz rooms count
        if self.wz_room_count > self.rooms.size
          self.set_rooms_from_count(facility.wz_room_count)
        end
      end
    end
  end
end