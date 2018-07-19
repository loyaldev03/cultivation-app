module FacilityWizardForm
  class BasicInfoForm
    include ActiveModel::Model

    attr_accessor :id,
                  :name,
                  :code,
                  :company_name,
                  :state_license,
                  :site_license,
                  :timezone,
                  :is_complete,
                  :is_enabled,
                  :address_address,
                  :address_city,
                  :address_state,
                  :address_zipcode,
                  :address_country,
                  :address_main_number,
                  :address_fax_number

    validates :name, presence: true
    validates_with UniqFacilityCodeValidator

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        @facility = SaveFacility.call(self).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id]
      self.name = record[:name]
      self.code = record[:code]
      self.company_name = record[:company_name]
      self.state_license = record[:state_license]
      self.site_license = record[:site_license]
      self.timezone = record[:timezone]
      self.is_complete = record[:is_complete]
      self.is_enabled = record[:is_enabled]
      self.address = record[:address]
      self.address_address = record[:address_address]
      self.address_city = record[:address_city]
      self.address_state = record[:address_state]
      self.address_zipcode = record[:address_zipcode]
      self.address_country = record[:address_country]
      self.address_main_number = record[:address_main_number]
      self.address_fax_numbe = record[:address_fax_numbe]
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
        self.code = generate_code
      else
        saved = FindFacility.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end

    def generate_code
      last_record = FindLastFacility.call.result
      cmd = NextFacilityCode.call(:facility, last_record&.code)
      cmd.result
    end
  end
end
