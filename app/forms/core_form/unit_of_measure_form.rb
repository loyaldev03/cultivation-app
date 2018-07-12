module CoreForm
  class UnitOfMeasureForm
    include ActiveModel::Model

    attr_accessor :id, :name, :code, :desc

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqUomCodeValidator

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      uom.attributes = params.slice(:name, :code, :desc)
      if valid?
        uom.save!
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
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = UnitOfMeasure.find_by(id: record_id)
        map_attributes(saved) if saved
      end
    end
  end
end
