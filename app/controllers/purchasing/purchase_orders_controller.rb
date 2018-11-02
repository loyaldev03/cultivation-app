class Purchasing::PurchaseOrdersController < ApplicationController
  def index
    @records = QueryPurchaseOrder.call.result
  end
end
