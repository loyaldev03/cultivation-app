class FacilityBasicInfoForm
  include ActiveModel::Model

  delegate :id, :name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax, to: :facility

  validates :name, presence: true

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
    @facility ||= Facility.new
  end
end
