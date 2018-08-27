module FacilityWizardForm
  class RoomsForm
    ATTRS = [:facility_id, :facility, :rooms, :wz_room_count]

    attr_accessor(*ATTRS)

    def initialize(facility_id)
      @facility_id = facility_id
      @rooms = []
      set_record(facility_id)
    end

    def has_sections
      self.rooms.any? { |r| r.has_sections }
    end

    def generate_rooms(rooms_count = 0)
      @wz_room_count = rooms_count
      if @rooms.blank?
        @rooms = Array.new(rooms_count) do |i|
          RoomInfoForm.new(@facility_id, {
            id: BSON::ObjectId.new,
            code: "RM#{i + 1}", # TODO: Use sequence generator
            name: "Room #{i + 1}",
            wz_generated: true
          })
        end
      else
        if rooms_count <= @rooms.size
          @rooms = @rooms.first(rooms_count)
        else
          missing_count = rooms_count - @rooms.size
          last_code = @rooms.last.code
          missing_rooms = Array.new(missing_count) do |i|
            next_count = i + 1
            room_code = NextFacilityCode.call(:room, last_code, next_count).result
            room_name = "Room #{@rooms.size + next_count}"
            RoomInfoForm.new(@facility_id, {
              id: BSON::ObjectId.new,
              code: room_code,
              name: room_name,
              wz_generated: true
            })
          end
          @rooms.concat(missing_rooms)
        end
      end
    end

    private

    def set_record(facility_id)
      raise ArgumentError, 'Invalid Facility' if facility_id.nil?
      find_cmd = FindFacility.call({id: facility_id})
      if find_cmd.success?
        facility = find_cmd.result
        if facility.rooms.blank?
          @wz_room_count = 0
          @rooms ||= []
        else
          @wz_room_count = facility.rooms.size
          @rooms = facility.rooms.map do |room|
            RoomInfoForm.new(@facility_id, room)
          end
        end
      end
    end
  end
end
