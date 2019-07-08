class GenerateItemFromPackagePlan
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    # get list of ProductType Plan by batch_id
    # get list of Items for batch_id
    # generate item from each plan, no duplicate
    logger.debug "Perform GenerateItemFromPackagePlan with #{batch.name}"
  end

  private

  def batch
    @batch ||= Cultivation :Batch.find(@batch_id)
  end
end
