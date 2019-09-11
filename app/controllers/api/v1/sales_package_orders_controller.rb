class Api::V1::SalesPackageOrdersController < Api::V1::BaseApiController
  def index
    orders = Sales::PackageOrder.all
    render json: Sales::PackageOrderSerializer.new(orders).serialized_json
  end

  def create
    package_ids = params[:packages].map { |a| a[:id] }
    order = Sales::PackageOrder.create(
      order_no: params[:order_no],
      status: 'new',
      customer_id: params[:customer_id], #assuming customer id present
    )
    packages = Inventory::ItemTransaction.in(id: package_ids)
    packages.update_all(package_order_id: order.id, status: 'sold')
    render json: {data: 'success create'}
    #create order with many packages
    #added new customer doesnt exist
  end

  def get_next_order_no
    render json: {data: Sales::PackageOrder.get_next_order_no}
  end
end
