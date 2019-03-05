class Api::V1::NutrientProfilesController < Api::V1::BaseApiController
  def index
    query_cmd = Cultivation::QueryNutrients.call(params[:batch_id],
                                                 params[:phases])
    if query_cmd.success?
      render json: {data: query_cmd.result.as_json}
    else
      render json: {errors: update_cmd.errors}
    end
  end

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
