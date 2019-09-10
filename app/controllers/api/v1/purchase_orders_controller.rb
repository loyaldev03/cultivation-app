class Api::V1::PurchaseOrdersController < Api::V1::BaseApiController
  def index
    @pos = Inventory::PurchaseOrder.where(vendor_id: params[:vendor_id])
    @pos = @pos.where(:purchase_order_no => /^#{params[:filter]}/i).limit(7).map do |x|
      {
        value: x.id.to_s,
        label: x.purchase_order_no,
        purchase_order_date: x.purchase_order_date&.iso8601,
        vendor_id: x.vendor_id.to_s,
        status: x.status,
      }
    end

    render json: @pos
  end

  def create
    package_ids = params[:packages].map { |a| a[:id] }
    order = Sales::PackageOrder.create(
      status: 'new',
      customer_id: params[:customer_id], #assuming customer id present
    )
    packages = Inventory::ItemTransaction.in(id: package_ids)
    packages.update_all(package_order_id: order.id, status: 'sold')

    #create order with many packages
    #update package order_id
    #added new customer doesnt exist
  end
end
