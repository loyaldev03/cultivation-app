class FacilitySummaryView
  include ActiveModel::Model

  delegate :id, :name, :room_count, to: :@facility

  def initialize(_facility)
    @facility = _facility
  end

  def submit(params)
    return true
  end
end
