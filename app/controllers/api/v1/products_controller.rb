class Api::V1::ProductsController < Api::V1::BaseApiController
  def index
    type = params[:type]
    category = params[:category]
    sub_category = params[:sub_category]
    key = params[:key]
    facility_id = params[:facility_id].to_s
    facility_strain_id = params[:facility_strain_id].to_s
    catalogue_ids = catalogue_ids(get_type(type), category, sub_category, key)
    products = []

    if params[:filter].blank?
      products = Inventory::Product.in(catalogue: catalogue_ids)
    else
      products = Inventory::Product.in(catalogue: catalogue_ids).where(name: /^#{params[:filter]}/i)
    end
    products = products.where(facility_id: facility_id) if facility_id.present?

    products = products.where(facility_strain_id: facility_strain_id) if facility_strain_id.present?

    products = products.limit(7).order(name: :asc)
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  private

  def catalogue_ids(type, category, sub_category, key)
    Inventory::QueryCatalogueTree.call(type, category, sub_category, key).result.pluck(:value)
  end

  def get_type(type)
    case type
    when 'raw_materials'
      return Constants::RAW_MATERIALS_KEY
    else
      return Constants::RAW_MATERIALS_KEY
    end
  end
end
