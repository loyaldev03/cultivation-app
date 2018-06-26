class FacilityRowSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, to: :facility, prefix: true
  delegate :id, :name, :code, :row_count, :shelf_count, to: :section, prefix: true
  delegate :id, to: :room, prefix: true
  delegate :id, :name, :code, :shelves, to: :row, prefix: true

  validates :row_name, presence: true
  validates :row_code, presence: true
  validate :verify_unique_row_code
  validate :verify_shelves

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
    @row ||= set_rows
  end

  def missing_row_count
    @missing_row_count ||= section.row_count if rows.blank?
    @missing_row_count ||= section.row_count - rows.size
  end

  def missing_shelf_count
    @missing_shelf_count ||= section.shelf_count if row&.shelves&.blank?
    @missing_shelf_count ||= section.shelf_count - row&.shelves&.size
  end

  private

  def map_shelves_from_params(_shelves)
    row.shelves = []
    set_shelves(_shelves)
    _shelves.each { |s| find_and_update_shelf(s) } if _shelves.present?
  end

  def get_row(row_id = nil)
    row_id.nil? ? rows.first : rows.detect { |r| r.id.to_s == row_id }
  end

  def set_rows(row_id = nil)
    rows.build(id: row_id) if rows.blank? && row_id.present?
    if missing_row_count > 0
      rows << Array.new(missing_row_count) { |i| Row.new(code: i + 1) }
    end
    rows || []
  end

  def set_shelves(_shelves = nil)
    if row&.shelves&.blank? && _shelves.present?
      row.shelves << Array.new(_shelves.size) do |i|
        build_shelf(_shelves[i], i + 1)
      end
    elsif missing_shelf_count.positive?
      row.shelves << Array.new(missing_shelf_count) do |i|
        build_shelf(nil, i + 1 + missing_shelf_count)
      end
    else
      row.shelves ||= []
    end
  end

  def build_shelf(_shelf, code)
    if _shelf.blank?
      Shelf.new(code: code, capacity: section.shelf_capacity)
    else
      Shelf.new(_shelf)
    end
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
    if row.code.present?
      exist = rows.any? { |r| r.code == row.code && r.id != row.id }
      errors.add(:row_code, 'already exists') if exist
    end
  end

  def verify_shelves
    if row&.shelves&.any?
      row.shelves.each_with_index do |s, i|
        if s.code.blank?
          errors.add("Shelves ID ##{i + 1}", 'is required')
          return
        end
      end
      row.shelves.each_with_index do |s, i|
        count_exist = row.shelves.select { |r| s.code == r.code }.count
        if count_exist > 1
          errors.add("Shelves ID ##{i + 1}", "(#{s.code}) already being used")
          return
        end
      end
    end
  end
end
