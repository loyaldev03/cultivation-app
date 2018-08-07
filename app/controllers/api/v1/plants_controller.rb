class Api::V1::PlantsController < Api::V1::BaseApiController
  def index
    Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
    render json: [{data: Inventory::Item.where(storage_type: ['seed', 'mother', 'clone'])}]
  end

  def strains
  end
end
