class Api::V1::HarvestsController < Api::V1::BaseApiController
  def index
    harvest_batches = Inventory::HarvestBatch.all.includes(:facility_strain, :cultivation_batch, :plants)
    render json: HarvestBatchSerializer.new(harvest_batches).serialized_json, status: 200
  end
end
