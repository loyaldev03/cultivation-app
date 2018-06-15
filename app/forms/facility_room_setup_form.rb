class FacilityRoomSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, :rooms, to: :facility, prefix: true
  delegate :id, :name, :code, :desc, to: :room, prefix: true

  validates :facility_id, presence: true
  validates :facility_name, presence: true
  validates :facility_code, presence: true
  validates :room_id, presence: true
  validates :room_name, presence: true
  validates :room_code, presence: true
  validates :room_desc, presence: true

  def initialize(_facility, _room_id = nil)
    @facility = _facility
    @room = _room_id.nil? ? _facility.rooms.first : _facility.rooms.detect { |r| r.id.to_s == _room_id }
  end

  def facility
    @facility
  end

  def room
    @room
  end

  def submit(params)
    @room.name = params[:room_name]
    @room.code = params[:room_code]
    # TODO: Validate uniqueness of room code
    if valid?
      return true
    else
      return false
    end
  end
end
