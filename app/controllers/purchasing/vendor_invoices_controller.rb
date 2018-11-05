class Purchasing::VendorInvoicesController < ApplicationController
  def index
    @records = QueryVendorInvoice.call.result
  end

  def show
    @record = PurchasingForm::VendorInvoiceForm.new(params[:id])
  end
end
