class Api::V1::NutrientProfilesController < Api::V1::BaseApiController
  def create
    nutrient_profile = Cultivation::SaveNutrientProfile.call(nutrient_params).result
    render json: {data: nutrient_profile}
  end

  def update
    nutrient_profile = Cultivation::SaveNutrientProfile.call(nutrient_params).result
    render json: {data: nutrient_profile}
  end

  private

  def nutrient_params
    params.require(:nutrient_profile).permit(:id, :batch_id, nutrients: [:category, :name, :value])
  end
end
