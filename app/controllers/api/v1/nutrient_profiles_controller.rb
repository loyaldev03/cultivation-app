class Api::V1::NutrientProfilesController < Api::V1::BaseApiController
  before_action :set_batch

  def index
    nutrient_profile = @batch.nutrient_profile
    render json: nutrients_json(nutrient_profile)
  end

  def create
    nutrient_profile = @batch.build_nutrient_profile(nutrient_params)
    nutrient_profile.save
    render json: nutrients_json(nutrient_profile)
  end

  def update
  end

  private

  def nutrients_json(nutrients)
    options = {}
    options[:is_collection]
    return NutrientSerializer.new(nutrients, options).serialized_json
  end

  def set_batch
    @batch = Cultivation::FindBatch.call({id: params[:batch_id]}).result
  end

  def nutrient_params
    params.require(:nutrient_profile).permit(nutrients: [])
  end
end
