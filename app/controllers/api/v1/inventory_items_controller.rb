class Api::V1::InventoryItemsController < Api::V1::BaseApiController
  def raw_materials
    raw_materials = Inventory::Catalogue.raw_materials.where(
      facility_id: params[:facility_id],
      category: params[:type],
      :uom_dimension.not.eq => nil,
    )

    items = Inventory::ItemTransaction.where(
      event_type: 'stock_intake',
      :catalogue_id.in => catalogue_ids,
      facility_id: params[:facility_id],
    )
    render json: {data: items}
  end

  def setup_raw_materials
    render json: {data: 'ok!'}
  end
end
