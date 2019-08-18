class Api::V1::PlantWasteReasonsController < Api::V1::BaseApiController
  def index
    reasons = Cultivation::PlantWasteReason.only(:name).all.to_a
    render json: reasons.to_json, status: 200
  end
end
