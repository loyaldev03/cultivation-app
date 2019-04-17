class SaveRoomIsComplete
  prepend SimpleCommand

  def initialize(room)
    @room = room
  end

  def call
    @room.is_complete = get_is_complete(@room.rows)
    @room.save!
    # Rails.logger.debug ">>> + SaveRowIsComplete <<<"
    # Rails.logger.debug ">>> wz_shelves_count: #{@row.wz_shelves_count}"
    # Rails.logger.debug ">>> wz_trays_count: #{@row.wz_trays_count}"
    # Rails.logger.debug ">>> is_complete: #{@row.is_complete}"
    # Rails.logger.debug ">>> - SaveRowIsComplete <<<"
    @room
  end

  class << self
    def call_by_id(facility_id, room_id)
      facility = Facility.find(facility_id)
      room = facility.rooms.detect { |r| r.id == room_id.to_bson_id }
      SaveRoomIsComplete.call(room)
    end
  end

  private

  def get_is_complete(rows)
    # LOGIC#0001 - No rows setup for these types of room
    if Constants::ROOM_ONLY_SETUP.include?(@room.purpose)
      return true
    end
    if rows.blank?
      false
    else
      res = rows.any? { |x| x.is_complete == false }
      !res
    end
  end
end
