class Api::V1::ItemsController < Api::V1::BaseApiController
  before_action :set_batch

  def index
    nutrient_profile = @batch.nutrient_profile
    @nutrients = nutrient_profile.nutrients
  end

  private

  def set_batch
    @batch = Cultivation::Batch.find(params[:batch_id])
  end
end
