module FacilityWizardForm
  class BasicInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:id,
             :name,
             :code,
             :site_license,
             :timezone,
             :is_complete,
             :is_enabled,
             :address_address,
             :address_city,
             :address_state,
             :address_zipcode,
             :address_country,
             :address_email,
             :address_main_number,
             :address_fax_number]

    attr_accessor(*ATTRS)

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqFacilityCodeValidator

    def initialize(record_id = nil)
      set_record(record_id)
    end

    # Note: params should include :id for update operation
    def submit(params, current_user)
      raise ArgumentError, 'Missing current_user' if current_user.nil?

      map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveFacility.call(self, current_user)
        if save_cmd.success?
          map_attrs_from_model(save_cmd.result) if save_cmd.success?
        end
      else
        false
      end
    end

    private

    def map_attrs_from_model(record)
      self.id = record.id
      self.name = record.name
      self.code = record.code
      self.site_license = record.site_license
      self.timezone = record.timezone
      self.is_complete = record.is_complete
      self.is_enabled = record.is_enabled
      if record.address
        self.address_address = record.address.address
        self.address_city = record.address.city
        self.address_state = record.address.state
        self.address_zipcode = record.address.zipcode
        self.address_country = record.address.country
        self.address_email = record.address.email
        self.address_main_number = record.address.main_number
        self.address_fax_number = record.address.fax_number
      end
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
        self.code = generate_code
      else
        find_cmd = FindFacility.call({id: record_id})
        if find_cmd.success?
          map_attrs_from_model(find_cmd.result)
        end
      end
    end

    def generate_code
      last_record = FindLastFacility.call.result
      cmd = NextFacilityCode.call(:facility, last_record&.code)
      cmd.result
    end
  end
end
