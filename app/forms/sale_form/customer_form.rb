module SaleForm
  class CustomerForm
    include ActiveModel::Model

    attr_accessor :id, :name, :account_no, :addresses

    validates :name, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        SaveCustomer.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.name = record[:name] if record[:name]
      self.account_no = record[:account_no] if record[:account_no]
      if record[:addresses].any?
        self.addresses = []
        self.addresses.build({

          id: record[:addresses][:id],
          address: record[:addresses][:address],
          zipcode: record[:addresses][:zipcode],
        })
      end
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindCustomer.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
