class Api::V1::ProductsController < Api::V1::BaseApiController
  def index
    type = params[:type]
    category = params[:category]
    sub_category = params[:sub_category]

    catalogue_ids = catalogue_ids(get_type(type), category, sub_category)
    products = []

    if category.blank? || type.blank?
      render json: Inventory::ProductSerializer.new(products).serialized_json
      return
    end

    if params[:filter].blank?
      products = Inventory::Product.in(catalogue: catalogue_ids).limit(7).order(name: :asc)
    else
      products = Inventory::Product.in(catalogue: catalogue_ids).where(:name => /^#{params[:filter]}/i).limit(7).order(name: :asc)
    end
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  private

  def catalogue_ids(type, category, sub_category)
    Inventory::QueryCatalogueTree.call(type, category, sub_category).result.pluck(:value)
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
