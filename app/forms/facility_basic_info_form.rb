class FacilityBasicInfoForm
  include ActiveModel::Model

  delegate :id, :name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax, to: :facility

  validates :name, presence: true
  validates :code, presence: true
  validates_with UniqFacilityCodeValidator

  def initialize(_facility = nil)
    @facility = _facility
  end

  def submit(params)
    facility.attributes = params.slice(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax, to: :facility)
    if valid?
      facility.save!
    else
      false
    end
  end

  private

  def facility
    if @facility.nil?
      next_code = NextFacilityCode.call(last_code: Facility.last&.code, code_type: :facility).result
      @facility = Facility.new(code: next_code)
    else
      @facility
    end
  end
end
