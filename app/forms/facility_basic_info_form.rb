class FacilityBasicInfoForm
  include ActiveModel::Model

  delegate :id, :name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax, to: :facility

  attr_reader :current_user

  validates :name, presence: true
  validates :code, presence: true
  validates_with UniqFacilityCodeValidator

  def initialize(_facility = nil, current_user)
    @facility = _facility
    @current_user = current_user
  end

  def submit(params)
    facility.attributes = params.slice(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax, to: :facility)
    if valid?
      @facility = SaveFacility.call(params).result
    else
      false
    end
  end

  private

  def facility
    if @facility.nil?
      next_code = NextFacilityCode.call(:facility, Facility.last&.code).result
      @facility = Facility.new(code: next_code)
    else
      @facility
    end
  end
end
