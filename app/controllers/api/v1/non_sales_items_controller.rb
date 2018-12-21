class Api::V1::NonSalesItemsController < Api::V1::BaseApiController
  def setup
    Rails.logger.info params

    command = Inventory::SetupNonSalesItem.call(current_user, non_sales_item_params)
    if command.success?
      id = command.result.id
      result = item_to_serialize(catalogue_type: nil, id: id, event_types: %w(inventory_setup))
      render json: Inventory::NonSalesItemSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  private

  def non_sales_item_params
    params[:non_sales_item].to_unsafe_h
  end

  def request_with_errors(errors)
    params[:non_sales_item].to_unsafe_h.merge(errors: errors)
  end

  def item_to_serialize
    ## TODO: serialize item
  end
end
