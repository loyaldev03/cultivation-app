module Cultivation
  class BatchForm
    include ActiveModel::Model

    attr_accessor :id, :facility_id, :batch_source, :strain_id, :start_date, :grow_method, :estimated_harvest_date, :tasks

    validates :batch_source, presence: true
    validates :strain_id, presence: true

    def initialize(record_id = nil)
      set_record(record_id)
    end

    def submit(params)
      map_attributes(params)
      if valid?
        Cultivation::SaveBatch.call(params).result
      else
        false
      end
    end

    private

    def map_attributes(record)
      self.id = record[:id] if record[:id]
      self.facility_id = record[:facility_id]
      self.batch_source = record[:batch_source] if record[:batch_source]
      self.strain_id = record[:strain_id] if record[:strain_id]
      self.start_date = record[:start_date] if record[:start_date]
      self.grow_method = record[:grow_method] if record[:grow_method]
      self.estimated_harvest_date = record[:estimated_harvest_date] if record[:estimated_harvest_date]
      self.tasks = record.try(:tasks)
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = Cultivation::FindBatch.call({id: record_id}).result
        map_attributes(saved) if saved
      end
    end
  end
end
