class FacilityRoomSetupForm
  include ActiveModel::Model

  attr_accessor :room_have_sections
  delegate :id, :name, :code, :room_count, :rooms, to: :facility, prefix: true
  delegate :id, :name, :code, :desc, :is_complete, :section_count, to: :room, prefix: true

  validates :facility_id, presence: true
  validates :facility_name, presence: true
  validates :facility_code, presence: true
  validates :room_id, presence: true
  validates :room_name, presence: true
  validates :room_code, presence: true
  validates :room_section_count, presence: true
  validates_with UniqRoomCodeValidator

  def initialize(_facility, _room_id = nil)
    @facility = _facility
    @room = _room_id.nil? ? _facility.rooms.first : _facility.rooms.detect { |r| r.id.to_s == _room_id }
    set_section_count
  end

  def facility
    @facility
  end

  def room
    @room
  end

  def name_of_room(index = 0)
    facility_rooms[index]&.name || "#{index + 1}"
  end

  def current_room_number
    current_room_index = facility.rooms.index { |r| r.id == room.id }
    current_room_index + 1
  end

  def room_have_sections
    room.section_count > 1
  end

  def submit(params)
    room.name = params[:room_name]
    room.code = params[:room_code]
    room.desc = params[:room_desc]
    room.section_count = params[:room_section_count].blank? ? 1 : params[:room_section_count]

    if valid?
      # TODO: Re-think how this would work if user edit a facility, since we
      # do not want to regenerate the sections
      room.sections = room.section_count.times.map { Section.new } unless room.is_complete
      room.save!
    else
      return false
    end
  end

  private

  def set_section_count
    if room.section_count.blank?
      room.section_count = room.sections.blank? ? 1 : room.sections.size
    end
  end
end
