class SaveShelf
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    save_record
  end

  private

  def save_record
    facility = Facility.find(args[:facility_id])
    room = facility.rooms.find(args[:room_id])
    row = room.rows.find(args[:row_id])
    shelf = row.shelves.find(args[:id])
    shelf.code = args[:code]
    # Rails.logger.debug ">>> save_shelf facility: #{facility.id}"
    # Rails.logger.debug ">>> save_shelf room: #{room.id}"
    # Rails.logger.debug ">>> save_shelf row: #{row.id}"
    # Rails.logger.debug ">>> save_shelf shelf: #{shelf.id}"
    # Rails.logger.debug ">>> save_shelf trays: #{args[:trays]}"
    if args.try(:trays) || args[:trays].any?
      # Rails.logger.debug ">>> save_shelf update capacity: #{args[:trays]}"
      shelf.capacity = calculate_capacity(args[:trays])
    end
    shelf.is_complete = get_is_complete(args[:trays])
    shelf.wz_generated = false
    shelf.save!

    # NOTE: Update is_complete flag for current row
    SaveRowIsComplete.call(row)

    # NOTE: Update is_complete flag for current room
    SaveRoomIsComplete.call(room)

    shelf
  end

  def calculate_capacity(trays)
    if trays.blank?
      0
    else
      trays.reduce(0) { |sum, hash| sum + hash[:capacity].to_i }
    end
  end

  def get_is_complete(trays)
    have_blank = trays.detect { |t| t[:capacity].blank? || t[:capacity_type].blank? }
    return !have_blank
  end
end
