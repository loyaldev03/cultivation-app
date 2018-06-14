class FacilityRoomCountForm
  include ActiveModel::Model

  delegate :id, :name, :room_count, to: :@facility

  validates :room_count, presence: true

  def initialize(facility)
    @facility = facility
  end

  def submit(params)
    @facility.attributes = params.slice(:room_count)
    if valid?
      @facility.rooms = @facility.room_count.times.map { Room.new }
      @facility.save!
    else
      false
    end
  end
end
