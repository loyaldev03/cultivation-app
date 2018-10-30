class Api::V1::UomsController < Api::V1::BaseApiController
  def index
    uoms = Common::UnitOfMeasure.all
    uom_serializer = Common::UomSerializer.new(uoms).serialized_json
    render json: uom_serializer
  end
end
