class Api::V1::RawMaterialsController < Api::V1::BaseApiController
  def index
    result = get_material_with_serializer_options(catalogue_type: params[:type], id: nil, event_types: %w(inventory_setup))
    render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  def setup
    command = Inventory::SetupRawMaterial.call(current_user, raw_material_params)
    if command.success?
      id = command.result.id
      result = get_material_with_serializer_options(catalogue_type: nil, id: id, event_types: %w(inventory_setup))
      render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def show
    result = get_material_with_serializer_options(catalogue_type: nil, id: params[:id], event_types: %w(inventory_setup))
    render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  private

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end

  def get_material_with_serializer_options(catalogue_type:, id:, event_types:)
    result = Inventory::QueryRawMaterialWithRelationships.call(type: catalogue_type, id: id, event_types: event_types).result
    item_transactions = result[:item_transactions]
    vendor_invoice_items = result[:vendor_invoice_items]
    options = {params: {
      include: [:vendor_invoice, :vendor, :purchase_order],
      relations: {
        vendor_invoice_items: vendor_invoice_items,
      },
    }}

    {
      item_transactions: item_transactions,
      options: options,
    }
  end

  def raw_material_params
    params[:raw_material].to_unsafe_h
  end
end
