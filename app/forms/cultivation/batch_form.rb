module Cultivation
  class BatchForm
    include ActiveModel::Model

    attr_accessor :id, :batch_source, :strain, :start_date, :tasks

    validates :batch_source, presence: true
    validates :strain, presence: true

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
      self.batch_source = record[:batch_source] if record[:batch_source]
      self.strain = record[:strain] if record[:strain]
      self.start_date = record[:start_date] if record[:start_date]
      self.tasks = record.try(:tasks)
    end

    def set_record(record_id)
      if record_id.nil?
        self.id = BSON::ObjectId.new
      else
        saved = Cultivation::FindBatch.call({id: record_id}).result
        Rails.logger.debug 'Saved'
        map_attributes(saved) if saved
      end
    end
  end
end