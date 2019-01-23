class UpdateBatchStatus < Mongoid::Migration
  def self.up
    batches = Cultivation::Batch.all
    batches.each do |i|
      if i['is_active'].present?
        i.status = Constants::BATCH_STATUS_SCHEDULED
        i.save!
      end
    end
  end

  def self.down
  end
end
