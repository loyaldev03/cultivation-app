module Inventory
  class RawMaterialForm
    include ActiveModel::Model

    attr_accessor :id, :label, :uom_dimension, :default_price

    validates :label, presence: true
    validates :uom_dimension, presence: true
    validates :default_price, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        SaveCatalogue.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.label = record[:label] if record[:label]
      self.uom_dimension = record[:uom_dimension] if record[:uom_dimension]
      self.default_price = record[:default_price] if record[:default_price]
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindCatalogue.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
