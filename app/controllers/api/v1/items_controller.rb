class Api::V1::ItemsController < Api::V1::BaseApiController
  before_action :set_task, only: [:create, :destroy]
  before_action :set_item, only: [:destroy]

  def index
    items = Inventory::Item.all
    options = {}
    options[:is_collection]
    item_json = Inventory::ItemSerializer.new(items, options).serialized_json
    render json: item_json
  end

  def create
    item = @task.items.new(item_params)
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
    @item = @task.items.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:name, :quantity, :uom)
  end
end
