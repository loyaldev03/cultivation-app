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
    shelf.capacity = calculate_capacity(args[:trays])
    shelf.wz_generated = false
    shelf.save!
    shelf
  end

  def calculate_capacity(trays)
    if trays.blank?
      0
    else
      trays.sum {|h| h[:capacity]}
    end
  end
end
