module PurchasingForm
  class PurchaseOrderForm
    include ActiveModel::Model

    attr_accessor :id, :purchase_order_no, :purchase_order_date, :status, :completed_date, :facility, :vendor, :items

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        Inventory::SavePurchaseOrder.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.purchase_order_no = record[:purchase_order_no] if record[:purchase_order_no]
      self.purchase_order_date = record[:purchase_order_date] if record[:purchase_order_date]
      self.status = record[:status] if record[:status]
      self.completed_date = record[:completed_date] if record[:completed_date]
      self.facility = record.facility if record.facility
      self.vendor = record.vendor if record.vendor
      self.items = record.items if record.items
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindPurchaseOrder.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
