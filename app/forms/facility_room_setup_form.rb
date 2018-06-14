class FacilityRoomSetupForm
  include ActiveModel::Model

  delegate :id, :name, :code, to: :@facility

  validates :id, presence: true
  validates :name, presence: true
  validates :code, presence: true

  def initialize(facility)
    @facility = facility
  end

  def submit(params)
    return true
  end
end
