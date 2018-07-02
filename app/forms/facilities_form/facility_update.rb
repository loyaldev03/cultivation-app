module FacilitiesForm
  class FacilityUpdate
    include ActiveModel::Model
    attr_accessor :facility

    delegate :name,
             :code,
             :address,
             :zipcode,
             :city,
             :state,
             :country,
             :phone,
             :fax,
             :id,
             :is_enabled,
             to: :facility,
             prefix: false

    validates :code, :name, presence: true
    validate :code_must_be_unique

    def self.find(id)
      facility = Facility.find(id)
      form = FacilitiesForm::FacilityUpdate.new
      form.facility = facility
      form
    end

    def update(params)
      self.facility.attributes = params.slice(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)

      if valid?
        facility.save!
      else
        false
      end
    end

    def code_must_be_unique
      if Facility.not.where(id: id).where(code: code).count > 0
        errors.add(:code, 'must be unique.')
      end
    end
  end
end
