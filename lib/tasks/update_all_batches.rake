desc "Update all batches & tasks"

task update_all_batches: :environment do
  batches = Cultivation::Batch.where(:start_date.lte => Time.current)
  batches.each do |batch|
    if batch.status == Constants::BATCH_STATUS_DRAFT
      batch.status = Constants::BATCH_STATUS_SCHEDULED
    end
    UpdateBatchTasksWorker.new.perform(batch.id.to_s)
  end
end
