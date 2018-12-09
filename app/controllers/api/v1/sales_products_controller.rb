class Api::V1::SalesProductsController < Api::V1::BaseApiController
  def setup_harvest_package
    command = Inventory::SetupHarvestPackage.call(current_user, params[:sales_product].to_unsafe_h)
    if command.success?
      render json: command.result
    else
      render json: request_with_errors(errors), status: 422
    end
  end

  def setup_sales_product
  end

  def products
  end

  private

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end
end
