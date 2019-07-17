class GenerateBatchLots
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id

    # calculate total number of plant batch to generate
    #
    # create plant batch record if no existing records found (check metrc_id)
    #
    # do nothing if metrc id already exists
  end

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end
end
