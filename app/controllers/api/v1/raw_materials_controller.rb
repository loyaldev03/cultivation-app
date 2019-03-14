class Api::V1::RawMaterialsController < Api::V1::BaseApiController
  def index
    result = material_to_serialize(catalogue_type: params[:type], id: nil, event_types: %w(inventory_setup), facility_id: params[:facility_id])
    render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  def setup
    command = Inventory::SetupRawMaterial.call(current_user, raw_material_params)
    if command.success?
      id = command.result.id
      result = material_to_serialize(catalogue_type: nil, id: id, event_types: %w(inventory_setup), facility_id: params[:facility_id])
      render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_seed
    command = Inventory::SetupSeed.call(current_user, raw_material_params)
    if command.success?
      result = material_to_serialize(
        catalogue_type: Constants::SEEDS_KEY,
        id: command.result.id,
        event_types: %w(inventory_setup),
        facility_id: params[:facility_id],
      )

      render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_purchased_clones
    command = Inventory::SetupPurchasedClones.call(current_user, raw_material_params)
    if command.success?
      result = material_to_serialize(
        catalogue_type: Constants::PURCHASED_CLONES_KEY,
        id: command.result.id,
        event_types: %w(inventory_setup),
        facility_id: params[:facility_id],
      )

      render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def show
    result = material_to_serialize(catalogue_type: params[:type], id: params[:id], event_types: %w(inventory_setup), facility_id: params[:facility_id])
    render json: Inventory::RawMaterialSerializer.new(result[:item_transactions], result[:options]).serialized_json
  end

  private

  def request_with_errors(errors)
    params[:raw_material].to_unsafe_h.merge(errors: errors)
  end

  def material_to_serialize(catalogue_type:, id:, event_types:, facility_id:)
    result = Inventory::QueryRawMaterialWithRelationships.call(type: catalogue_type,
                                                               id: id,
                                                               event_types: event_types,
                                                               facility_id: facility_id).result
    item_transactions = result[:item_transactions]
    vendor_invoice_items = result[:vendor_invoice_items]
    additional_fields = [:vendor_invoice, :vendor, :purchase_order]

    if catalogue_type == Constants::SEEDS_KEY || catalogue_type == Constants::PURCHASED_CLONES_KEY
      additional_fields << :facility_strain
    end

    options = {params: {
      include: additional_fields,
      relations: {vendor_invoice_items: vendor_invoice_items},
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
