class Api::V1::ItemsController < Api::V1::BaseApiController
  before_action :set_batch

  def index
    nutrient_profile = @batch.nutrient_profile
    nutrients = nutrient_profile.try(:nutrients)
    options = {}
    options[:is_collection]
    nutrients_json = NutrientSerializer.new(nutrients, options).serialized_json
    render json: nutrients_json
  end

  private

  def set_batch
    @batch = Cultivation::Batch.find(params[:batch_id])
  end
end
