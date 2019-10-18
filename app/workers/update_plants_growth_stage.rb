class UpdatePlantsGrowthStage
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id, growth_stage)
    @batch_id = batch_id

    existing_plants.update_all(
      current_growth_stage: growth_stage,
    )
  end

  private

  def existing_plants
    @existing_plants ||= Inventory::Plant.where(
      cultivation_batch_id: @batch_id,
      destroyed_date: nil,
    )
  end
end
