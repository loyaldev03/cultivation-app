class FacilityRowSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, to: :facility, prefix: true
  delegate :id, :name, :code, :row_count, :shelf_count, :shelf_capacity, to: :section, prefix: true
  delegate :id, to: :room, prefix: true
  delegate :id, :name, :code, to: :row, prefix: true
  delegate :id, :name, :code, to: :shelf, prefix: true

  validate :verify_unique_row_code

  def initialize(_facility, _room_id, _section_id, _row_id = nil)
    @facility = _facility
    @room = facility.rooms.detect { |r| r.id.to_s == _room_id }
    @section = room.sections.detect { |s| s.id.to_s == _section_id }
    @row = set_row(_row_id)
  end

  def submit(params)
    row.id = params[:row_id]
    row.name = params[:row_name]
    row.code = params[:row_code]
    if valid?
      section.rows = [row] if section.rows.blank?
      facility.save!
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

  def row
    @row
  end

  def shelves
    @shelves ||= set_shelves
  end

  private

  def set_row(row_id)
    result ||= section.rows.blank? ? Row.new : section.rows.first if row_id.nil?
    result ||= section.rows.detect { |r| r.id.to_s == row_id }
  end

  def set_shelves
    results = Array.new(section.shelf_count)
    section.shelf_count.times do |i|
      results[i] = set_shelf(i)
    end
    results
  end

  def set_shelf(number)
    row.shelves[number] || Shelf.new({code: number + 1, capacity: section.shelf_capacity})
  end

  def verify_unique_row_code
    unless row.code.nil?
      errors.add(:row_code, 'already exists') if section.rows.any? { |r| r.code == row.code && r.id != row.id }
    end
  end
end
