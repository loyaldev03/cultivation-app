module Charts
  class RoomDetail
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id]
      @purpose = @args[:purpose]
      @name = @args[:name]
      @full_code = @args[:full_code]
    end

    def call
      facility_rooms = QueryFacilitySummary.call(facility_id: @facility_id).result.select { |room| room[:purpose] == @purpose }
      room = facility_rooms.detect { |room| room[:room_name] == @name and room[:room_code] == @full_code }
      room.store(:active_plants, 0)
      room.store(:room_temperature, 0)
      room.store(:humidity, 0)
      room.store(:light_hours, 0)
      room.store(:strain_distribution, 0)

      room
    end
  end
end
