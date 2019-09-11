class Api::V1::SalesPackageOrdersController < Api::V1::BaseApiController
  def index
    orders = Sales::PackageOrder.all
    render json: Sales::PackageOrderSerializer.new(orders).serialized_json
  end

  def create
    cmd = Sales::CreatePackageOrder.call(current_user, params)
    if cmd.success?
      render json: {data: 'success create'}
    else
      render json: {error: 'something wrong'}
    end
  end

  def get_next_order_no
    render json: {data: Sales::PackageOrder.get_next_order_no}
  end
end
