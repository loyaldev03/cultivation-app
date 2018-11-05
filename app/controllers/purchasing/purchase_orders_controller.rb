class Purchasing::PurchaseOrdersController < ApplicationController
  def index
    @records = QueryPurchaseOrder.call.result
  end

  def show
    @record = PurchasingForm::PurchaseOrderForm.new(params[:id])
    Rails.logger.debug "#{@record.inspect}"
  end
end
