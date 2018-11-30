class Api::V1::VendorInvoicesController < Api::V1::BaseApiController
  def index
    @invoices = Inventory::VendorInvoice.where(purchase_order_id: params[:purchase_order_id])
    @invoices = @invoices.where(:invoice_no => /^#{params[:filter]}/i) if params[:filter].present?
    @invoices = @invoices.limit(7).map do |x|
      {
        value: x.id.to_s,
        label: x.invoice_no,
        purchase_order_id: x.purchase_order_id.to_s,
        status: x.status,
      }
    end

    render json: @invoices
  end

  def show
    invoice = Inventory::VendorInvoice.includes(:purchase_order, :vendor).find(params[:id])
    @invoice = {
      invoice_id: invoice.id.to_s,
      invoice_no: invoice.invoice_no,
      purchase_order_id: invoice.purchase_order_id.to_s,
      purchase_order_no: invoice.purchase_order.purchase_order_no,
      purchase_order_date: invoice.purchase_order.purchase_order_date.iso8601,
      vendor_id: invoice.vendor_id.to_s,
      vendor_name: invoice.vendor.name,
      address: invoice.vendor.address,
      vendor_no: invoice.vendor.vendor_no,
    }

    render json: @invoice
  end
end
