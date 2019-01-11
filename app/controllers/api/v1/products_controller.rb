class Api::V1::ProductsController < Api::V1::BaseApiController
  def index
    type = params[:type]
    category = params[:category]
    sub_category = params[:sub_category]
    key = params[:key]
    facility_id = params[:facility_id].to_s
    facility_strain_id = params[:facility_strain_id].to_s

    case category
    when 'purchased_clone'
      catalogue_id = Inventory::Catalogue.purchased_clones.id
    when 'seeds'
      catalogue_id = Inventory::Catalogue.seed.id
    else
      catalogue_id = params[:catalogue_id].to_s
    end

    products = []

    if params[:filter].blank?
      products = Inventory::Product.in(catalogue: catalogue_id)
    else
      products = Inventory::Product.in(catalogue: catalogue_id).where(name: /^#{params[:filter]}/i)
    end
    products = products.where(facility_id: facility_id) if facility_id.present?

    products = products.where(facility_strain_id: facility_strain_id) if facility_strain_id.present?

    products = products.limit(7).order(name: :asc)
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end
end
