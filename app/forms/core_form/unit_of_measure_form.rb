module CoreForm
  class UnitOfMeasureForm
    include ActiveModel::Model

    attr_accessor :id, :name, :code, :desc, :base_unit, :base_uom, :conversion, :base_uom_select

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqUomCodeValidator

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        SaveUnitOfMeasure.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.name = record[:name] if record[:name]
      self.code = record[:code] if record[:code]
      self.desc = record[:desc] if record[:desc]
      self.base_unit = record[:base_unit] if record[:base_unit]
      self.base_uom = record[:base_uom] if record[:base_uom]
      self.conversion = record[:conversion] if record[:conversion]
      self.base_uom_select = Common::UnitOfMeasure.all
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = FindUnitOfMeasure.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
