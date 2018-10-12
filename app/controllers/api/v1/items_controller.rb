class Api::V1::ItemsController < Api::V1::BaseApiController
  before_action :set_task, only: [:create, :destroy]
  before_action :set_item, only: [:destroy]

  def index
    # items = Inventory::Item.all
    raw_materials = Inventory::RawMaterial.all
    options = {}
    options[:is_collection]
    raw_material_json = Inventory::RawMaterialSerializer.new(raw_materials, options).serialized_json
    # item_json = Inventory::ItemSerializer.new(items, options).serialized_json
    render json: raw_material_json
  end

  def create
    item = @task.items.new(item_params)
    item.save
    Rails.logger.debug "Errors =====> #{item.errors.inspect}"
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
    @item = @task.items.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:raw_material_id, :name, :quantity, :uom)
  end
end
