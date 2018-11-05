module PurchasingForm
  class VendorInvoiceForm
    include ActiveModel::Model

    attr_accessor :id, :invoice_no, :invoice_date, :status, :terms_in_days, :facility, :vendor, :purchase_order, :items

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        Inventory::SaveVendorInvoice.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.invoice_no = record[:invoice_no] if record[:invoice_no]
      self.invoice_date = record[:invoice_date] if record[:invoice_date]
      self.status = record[:status] if record[:status]
      self.terms_in_days = record[:terms_in_days] if record[:terms_in_days]
      self.facility = record.facility if record.facility
      self.vendor = record.vendor if record.vendor
      self.purchase_order = record.purchase_order if record.purchase_order
      self.items = record.items if record.items
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindVendorInvoice.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
