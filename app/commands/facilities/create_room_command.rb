class Facilities::CreateRoomCommand
  prepend SimpleCommand

  attr_reader :room, :facility

  def initialize(facility_id, room_attributes)
    @facility = Facility.find facility_id
    @room_attributes = room_attributes
  end

  def call
    @room = @facility.rooms.create(@room_attributes)
    if @room.valid?
      @facility.room_count += 1
      @facility.save!
    else
      errors.add(:room, 'Failed to create')
    end
  end
end
