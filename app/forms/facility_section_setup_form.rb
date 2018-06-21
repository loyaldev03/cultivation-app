class FacilitySectionSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, :room_count, to: :facility, prefix: true
  delegate :id, :name, :code, to: :room, prefix: true
  delegate :id, :name, :code, :desc, :purpose, :storage_types, :cultivation_types, :row_count, :shelf_count, :shelf_capacity, :is_complete, to: :section, prefix: true

  validates :section_name, presence: true
  validates :section_code, presence: true
  validate :verify_unique_section_code

  def initialize(_facility, _room_id, _section_id = nil)
    @facility = _facility
    @room = _facility.rooms.detect { |r| r.id.to_s == _room_id }
    @section = _section_id.nil? ? @room.sections.first : @room.sections.detect { |s| s.id.to_s == _section_id }
  end

  def submit(params)
    section.name = params[:section_name]
    section.code = params[:section_code]
    section.desc = params[:section_desc]
    section.purpose = params[:section_purpose]
    section.storage_types = params[:section_storage_types]
    section.cultivation_types = params[:section_cultivation_types]
    section.row_count = params[:section_row_count]
    section.shelf_count = params[:section_shelf_count]
    section.shelf_capacity = params[:section_shelf_capacity]

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

  private

  def verify_unique_section_code
    unless section.code.nil?
      errors.add(:section_code, 'already exists') if room.sections.any? { |s| s.code == section.code && s.id != section.id }
    end
  end
end
