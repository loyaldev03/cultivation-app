class Api::V1::CataloguesController < Api::V1::BaseApiController
  def index
    cat_type = params[:catalogue_type]
    records = Inventory::Catalogue.where(
      catalogue_type: cat_type,
    )

    if params[:category].present?
      records = records.where(category: params[:category])
    end

    if params[:is_active].present?
      records = records.where(is_active: params[:is_active])
    end

    options = {params: {uoms: Common::UnitOfMeasure.all.to_a}}

    records = Inventory::CatalogueSerializer.new(records, options)
    render json: records.serialized_json
  end

  def update
    record = Inventory::Catalogue.find(params[:id])
    record.is_active = params[:is_active] == true
    record.save

    options = {params: {uoms: record.uoms.to_a}}
    render json: Inventory::CatalogueSerializer.new(
      record,
      options,
    ).serialized_json
  end
end
