class Api::V1::ItemsController < Api::V1::BaseApiController
  def index
    items = Inventory::Item.all
    options = {}
    options[:is_collection]
    item_json = Inventory::ItemSerializer.new(items, options).serialized_json
    render json: item_json
  end

  def create
    item = @task.items.new(params)
    item.save
    render json: item.to_json
  end

  def destroy
    @item.destroy
  end

  private

  def set_task
    @task = Cultivation::Task.find(params[:task_id])
  end

  def set_item
    @item = @task.items.find(params[:id])
  end

  def item_params
  end
end
