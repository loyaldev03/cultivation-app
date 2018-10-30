class Api::V1::RawMaterialsController < Api::V1::BaseApiController
  def index
    raw_material_ids = Inventory::Catalogue.raw_materials.where(
      :uom_dimension.nin => [nil, ''],
      # facility_id: params[:facility_id],
      category: params[:type],
    ).pluck(:id)

    item_transactions = Inventory::ItemTransaction.where(
      event_type: 'inventory_setup',
      :catalogue_id.in => raw_material_ids,
      # facility_id: params[:facility_id],
    ).order(c_at: :desc)

    # TODO: Investigate include relationships
    options = {params: {include: [:vendor_invoice, :vendor, :purchase_order]}}
    render json: Inventory::RawMaterialSerializer.new(item_transactions, options).serialized_json
  end

  def setup
    command = Inventory::SetupRawMaterial.call(current_user, params[:raw_material].to_unsafe_h)
    if command.success?
      item_transaction = command.result
      options = {params: {include: [:vendor_invoice, :vendor, :purchase_order]}}
      render json: Inventory::RawMaterialSerializer.new(item_transaction, options).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  private

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end
end
