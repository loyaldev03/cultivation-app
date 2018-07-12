module MaterialsForm
  class ItemForm
    include ActiveModel::Model

    attr_accessor :id, :name, :code, :desc

    validates :name, presence: true
    validates :code, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(record)
      map_attributes(record)
      if valid?
        SaveItem.call(record).result
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
        saved = FindItem.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
