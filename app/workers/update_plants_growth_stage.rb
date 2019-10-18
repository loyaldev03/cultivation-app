
class UpdatePlantsGrowthStage
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    # Find all plants of a batch
    # update all plants to match batch status
  end

  private

  def batch
    @batch ||= Cultivation::Batch.includes.find(@batch_id)
  end

  def existing_plants
    @existing_plants ||= Inventory::Plant.where(cultivation_batch_id: @batch_id)
  end
end
