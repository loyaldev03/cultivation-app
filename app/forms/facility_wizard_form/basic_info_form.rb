module FacilityWizardForm
  class BasicInfoForm
    include ActiveModel::Model

    attr_accessor :id, :name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqFacilityCodeValidator

    def initialize(facility = nil)
      if facility.nil?
        # TODO: Move Facility.last to else where
        self.id = BSON::ObjectId.new
        self.code = NextFacilityCode.call(last_code: Facility.last&.code, code_type: :facility).result
      else
        map_attributes(facility)
      end
    end

    def submit(params)
      map_attributes(params)
      if valid?
        @facility = SaveFacility.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(facility)
      self.id = facility[:id] if facility[:id]
      self.name = facility[:name] if facility[:name]
      self.code = facility[:code] if facility[:code]
      self.address = facility[:address] if facility[:address]
      self.zipcode = facility[:zipcode] if facility[:zipcode]
      self.city = facility[:city] if facility[:city]
      self.state = facility[:state] if facility[:state]
      self.country = facility[:country] if facility[:country]
      self.phone = facility[:phone] if facility[:phone]
      self.fax = facility[:fax] if facility[:fax]
    end
  end
end
