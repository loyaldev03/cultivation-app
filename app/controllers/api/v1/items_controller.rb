class Api::V1::ItemsController < Api::V1::BaseApiController
  before_action :set_task, only: [:create, :destroy]
  before_action :set_item, only: [:destroy]

  def index
    batch = Cultivation::Batch.find(params[:batch_id])
    raw_materials = Inventory::Catalogue.raw_materials.where(facility_id: batch.facility_id)
    options = {}
    options[:is_collection]
    raw_material_json = Inventory::CatalogueSerializer.new(raw_materials, options).serialized_json
    render json: raw_material_json
  end

  def create
    item = @task.material_use.new(item_params)
    item.save
    item_json = Inventory::ItemSerializer.new(item).serialized_json
    render json: item_json
  end

  def destroy
    @item.destroy
    render json: {result: true}
  end

  private

  def set_task
    @task = Cultivation::Task.find(params[:task_id])
  end

  def set_item
    @item = @task.material_use.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:catalogue_id, :quantity, :uom)
  end
end
