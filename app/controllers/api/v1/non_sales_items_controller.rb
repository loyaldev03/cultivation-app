class Api::V1::NonSalesItemsController < Api::V1::BaseApiController
  def index
    result = item_to_serialize(catalogue_type: params[:type], id: nil, event_types: %w(inventory_setup))
    render json: Inventory::NonSalesItemSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  def setup
    command = Inventory::SetupNonSalesItem.call(current_user, non_sales_item_params)
    if command.success?
      id = command.result.id
      result = item_to_serialize(catalogue_type: nil, id: id, event_types: %w(inventory_setup))
      render json: Inventory::NonSalesItemSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def show
    result = item_to_serialize(catalogue_type: params[:type], id: params[:id], event_types: %w(inventory_setup))
    render json: Inventory::NonSalesItemSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  private

  def non_sales_item_params
    params[:non_sales_item].to_unsafe_h
  end

  def request_with_errors(errors)
    params[:non_sales_item].to_unsafe_h.merge(errors: errors)
  end

  def item_to_serialize(catalogue_type:, id:, event_types:)
    result = Inventory::QueryNonSalesItems.call(type: catalogue_type, id: id, event_types: event_types).result
    item_transactions = result[:item_transactions]
    vendor_invoice_items = result[:vendor_invoice_items]
    additional_fields = [:vendor_invoice, :vendor, :purchase_order]

    options = {params: {
      include: additional_fields,
      relations: {vendor_invoice_items: vendor_invoice_items},
    }}

    {
      item_transactions: item_transactions,
      options: options,
    }
  end
end
