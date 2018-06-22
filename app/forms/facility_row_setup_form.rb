class FacilityRowSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, to: :facility, prefix: true
  delegate :id, :name, :code, :row_count, :shelf_count, :shelf_capacity, to: :section, prefix: true
  delegate :id, to: :room, prefix: true
  delegate :id, :name, :code, to: :row, prefix: true
  delegate :id, :name, :code, to: :shelf, prefix: true

  validate :verify_unique_row_code

  def initialize(_facility, _room_id, _section_id, _row_id = nil)
    raise(ArgumentError, ':facility is required') if _facility.nil?
    raise(ArgumentError, ':room_id is required') if _room_id.nil?
    raise(ArgumentError, ':section_id is required') if _section_id.nil?

    @facility = _facility
    @room = facility.rooms.detect { |r| r.id.to_s == _room_id }
    @section = room.sections.detect { |s| s.id.to_s == _section_id }
    set_rows(_row_id)
    @row = get_row(_row_id)
    set_shelves
  end

  def submit(params)
    row.name = params[:row_name]
    row.code = params[:row_code]
    Rails.logger.debug params.to_json
    map_shelves_from_params(params[:shelves])
    if valid?
      section.save!
    else
      false
    end
  end

  def facility
    @facility
  end

  def room
    @room
  end

  def section
    @section
  end

  def rows
    @section.rows
  end

  def row
    @row
  end

  private

  def map_shelves_from_params(_shelves)
    set_shelves(_shelves)
    _shelves.each { |s| find_and_update_shelf(s) } if _shelves.present?
  end

  def get_row(row_id)
    row_id.nil? ? rows.first : rows.detect { |r| r.id.to_s == row_id }
  end

  def set_rows(row_id)
    rows.build({id: row_id}) if rows.blank? && row_id.present?
    rows << missing_row_count.times.map { |i| Row.new({code: i + 1}) } if missing_row_count > 0
    rows ||= []
  end

  def set_shelves(_shelves = nil)
    row.shelves << _shelves.size.times.map { |i| build_shelf(_shelves[i], i + 1) } if row.shelves.blank? && _shelves.present?
    row.shelves << missing_shelf_count.times.map { |i| build_shelf(nil, i + 1 + missing_shelf_count) } if missing_shelf_count > 0
    row.shelves ||= []
  end

  def missing_row_count
    @missing_row_count ||= rows.blank? ? section.row_count : section.row_count - rows.size
  end

  def missing_shelf_count
    @missing_shelf_count ||= row.shelves.blank? ? section.shelf_count : section.shelf_count - row.shelves.size
  end

  def build_shelf(_shelf, code)
    res = _shelf.blank? ? Shelf.new({code: code, capacity: section.shelf_capacity}) : Shelf.new(_shelf)
  end

  def find_and_update_shelf(_shelf)
    found = row.shelves.detect { |s| s.id.to_s == _shelf[:id] }
    unless found.nil?
      found.code = _shelf[:code]
      found.capacity = _shelf[:capacity]
      found.desc = _shelf[:desc]
    end
  end

  def verify_unique_row_code
    unless row.code.nil?
      errors.add(:row_code, 'already exists') if rows.any? { |r| r.code == row.code && r.id != row.id }
    end
  end
end
