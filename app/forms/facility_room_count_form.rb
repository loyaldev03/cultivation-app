class FacilityRoomCountForm
  include ActiveModel::Model

  delegate :id, :name, :room_count, to: :facility

  validates :room_count, presence: true

  def initialize(facility)
    @facility = facility
  end

  def submit(params)
    facility.attributes = params.slice(:room_count)
    if valid?
      # TODO: Re-think how this would work if user edit a facility, since we do
      # not want to regenerate the rooms. Probably shoudn't pre-generate the rooms.
      facility.rooms = facility.room_count.times.map { Room.new } unless facility.is_complete
      facility.save!
    else
      false
    end
  end

  def facility
    @facility
  end
end
