module MaterialsForm
  class ItemForm
    include ActiveModel::Model

    attr_accessor :id, :name, :code, :description, :uom, :facility

    validates :name, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        SaveItem.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.name = record[:name] if record[:name]
      self.description = record[:description] if record[:description]
      self.uom = record[:uom] if record[:uom]
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
