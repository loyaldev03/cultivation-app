class Api::V1::PurchaseOrdersController < Api::V1::BaseApiController
  def index
    Rails.logger.debug "\t\t\t>>>>>>>>>>>>>> #{params[:vendor_id]}"
    @pos = Inventory::PurchaseOrder.where(vendor_id: params[:vendor_id])
    Rails.logger.debug "\t\t\t>>>>>>>>>>>>>> #{params[:vendor_id]}, count: #{@pos.count}"

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
end
