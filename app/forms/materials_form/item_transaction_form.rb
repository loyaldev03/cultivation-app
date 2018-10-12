module MaterialsForm
  class ItemTransactionForm
    include ActiveModel::Model

    attr_accessor :id, :quantity, :uom, :trans_type, :item_id

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        SaveItemTransaction.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.quantity = record[:quantity] if record[:quantity]
      self.uom = record[:uom] if record[:uom]
      self.trans_type = record[:trans_type] if record[:trans_type]
      self.item_id = record[:item_id] if record[:item_id]
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindItem.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
