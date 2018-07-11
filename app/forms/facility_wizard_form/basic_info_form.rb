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
        self.code = NextFacilityCode.call(last_code: Facility.last&.code, code_type: :facility).result
      else
        self.id = facility.id
        self.name = facility.name
        self.code = facility.code
        self.address = facility.address
        self.zipcode = facility.zipcode
        self.city = facility.city
        self.state = facility.state
        self.country = facility.country
        self.phone = facility.phone
        self.fax = facility.fax
      end
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

    attr_reader :facility

    # def facility
    #   if @facility.nil?
    #     next_code = NextFacilityCode.call(last_code: Facility.last&.code, code_type: :facility).result
    #     @facility = Facility.new(code: next_code)
    #   else
    #     @facility
    #   end
    # end
  end
end
