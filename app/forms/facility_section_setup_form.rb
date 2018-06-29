class FacilitySectionSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, :room_count, to: :facility, prefix: true
  delegate :id, :name, :code, :section_count, :sections, to: :room, prefix: true
  delegate :id, :name, :code, :desc, :purpose, :storage_types, :cultivation_types, :row_count, :shelf_count, :shelf_capacity, :is_complete, to: :section, prefix: true

  validates :section_name, presence: true
  validates :section_code, presence: true
  validates :section_row_count, presence: true
  validate :verify_unique_section_code

  def initialize(_facility, _room_id, _section_id = nil)
    @facility = _facility
    @room = _facility.rooms.detect { |r| r.id.to_s == _room_id }
    @section = set_section(_section_id)
  end

  def submit(params)
    section.name = params[:section_name]
    section.code = params[:section_code]
    section.desc = params[:section_desc]
    section.purpose = params[:section_purpose]
    section.custom_purpose = params[:section_custom_purpose]
    section.storage_types = params[:section_storage_types]
    section.cultivation_types = params[:section_cultivation_types]
    section.row_count = params[:section_row_count]
    section.shelf_count = params[:section_shelf_count]
    section.shelf_capacity = params[:section_shelf_capacity]

    if valid?
      section.rows = section.row_count.times.map { Section.new } unless section.is_complete
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

  def missing_section_count
    set_section_count
    if room.sections.blank?
      room.section_count
    else
      room.section_count - room.sections.size
    end
  end

  def name_of_section(index)
    room.sections[index]&.name || "Section #{index + 1}"
  end

  private

  def set_section_count
    room.section_count = 1 if room.section_count.nil?
    if !room.sections.blank? && room.section_count < room.sections.size
      room.section_count = room.sections.size
    end
  end

  def set_section(_section_id)
    set_sections(_section_id)
    if _section_id.nil?
      room.sections.first
    else
      room.sections.detect { |s| s.id.to_s == _section_id }
    end
  end

  def set_sections(_section_id)
    if room.sections.blank?
      _section_id.nil? ? room.sections.build(id: _section_id) : room.sections.build
    end
    room.sections << Array.new(missing_section_count) do |i|
      build_section(i + 1)
    end
  end

  def build_section(code)
    code.nil? ? Section.new(code: code) : Section.new
  end

  def verify_unique_section_code
    unless section.code.nil?
      errors.add(:section_code, 'already exists') if room.sections.any? { |s| s.code == section.code && s.id != section.id }
    end
  end
end
