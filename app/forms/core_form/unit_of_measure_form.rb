module CoreForm
  class UnitOfMeasureForm
    include ActiveModel::Model

    attr_accessor :id, :name, :unit, :desc, :base_unit, :dimension, :conversion, :base_uom_select, :is_base_unit

    validates :name, presence: true
    validates :unit, presence: true
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
      self.unit = record[:unit] if record[:unit]
      self.desc = record[:desc] if record[:desc]
      self.is_base_unit = record[:is_base_unit] if record[:is_base_unit]
      self.dimension = record[:dimension] if record[:dimension]
      self.base_unit = record[:base_unit] if record[:base_unit]
      self.base_uom = record[:base_uom] if record[:base_uom]
      self.conversion = record[:conversion] if record[:conversion]
      self.base_uom_select = Common::UnitOfMeasure.base_unit.all
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
        self.base_uom_select = Common::UnitOfMeasure.base_unit.all
      else
        saved = FindUnitOfMeasure.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
