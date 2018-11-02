module PurchasingForm
  class VendorForm
    include ActiveModel::Model

    attr_accessor :id, :name, :default_terms, :status, :notes, :state_license_num, :state_license_expiration_date, :location_license_expiration_date, :location_license_num

    validates :name, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        Inventory::SaveVendor.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.name = record[:name] if record[:name]
      self.default_terms = record[:default_terms] if record[:default_terms]
      self.status = record[:status] if record[:status]
      self.notes = record[:notes] if record[:notes]
      self.state_license_num = record[:state_license_num] if record[:state_license_num]
      self.state_license_expiration_date = record[:state_license_expiration_date] if record[:state_license_expiration_date]
      self.location_license_expiration_date = record[:location_license_expiration_date] if record[:location_license_expiration_date]
      self.location_license_num = record[:location_license_num] if record[:location_license_num]
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindVendor.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
