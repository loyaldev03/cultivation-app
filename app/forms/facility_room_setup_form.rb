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
  validate :verify_unique_room_code

  def initialize(_facility, _room_id = nil)
    @facility = _facility
    @room = _room_id.nil? ? _facility.rooms.first : _facility.rooms.detect { |r| r.id.to_s == _room_id }
    self.room_have_sections = true
  end

  def facility
    @facility
  end

  def room
    @room
  end

  def submit(params)
    room.name = params[:room_name]
    room.code = params[:room_code]
    room.desc = params[:room_desc]
    room.section_count = params[:room_section_count]
    self.room_have_sections = params[:room_have_sections] == 'true'

    # TODO: Validate uniqueness of room code
    if valid?
      room.sections = room.section_count.times.map { Section.new } unless room.is_complete
      room.save!
    else
      return false
    end
  end

  private

  def verify_unique_room_code
    unless room.code.nil?
      errors.add(:room_code, 'already exists') if facility.rooms.any? { |r| r.code == room.code && r.id != room.id }
    end
  end
end
