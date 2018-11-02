class Purchasing::VendorInvoicesController < ApplicationController
  def index
    @records = QueryVendorInvoice.call.result
  end
end
