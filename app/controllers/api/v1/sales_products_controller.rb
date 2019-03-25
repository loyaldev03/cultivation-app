class Api::V1::SalesProductsController < Api::V1::BaseApiController
  def setup_harvest_package
    command = Inventory::SetupHarvestPackage.call(current_user, params[:sales_product].to_unsafe_h)
    if command.success?
      render json: Inventory::HarvestPackageSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def setup_converted_product
    command = Inventory::SetupConvertedProduct.call(current_user, params[:sales_product].to_unsafe_h)
    if command.success?
      render json: Inventory::HarvestPackageSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def products
    type = params[:type]
    if type.blank?
      render json: Inventory::ProductSerializer.new(products).serialized_json
      return
    end

    catalogue_ids = sales_catalogue_ids(type)
    products = []
    products = Inventory::Product.where(facility_id: params[:facility_id]).in(catalogue: catalogue_ids)
    if params[:filter].blank?
      products = products.limit(7).order(name: :asc)
    else
      products = products.where(:name => /^#{params[:filter]}/i).limit(7).order(name: :asc)
    end
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  def converted_products
    items = Inventory::ItemTransaction.where(facility_id: params[:facility_id]).includes(:product, :catalogue).
      in(catalogue: sales_catalogue_ids(Constants::CONVERTED_PRODUCT_KEY)).
      order(c_at: :desc)
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  def harvest_packages
    items = Inventory::ItemTransaction.where(facility_id: params[:facility_id]).includes(:product, :catalogue, :harvest_batch).
      in(catalogue: sales_catalogue_ids('raw_sales_product')).
      order(c_at: :desc)
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  def harvest_package
    items = Inventory::ItemTransaction.includes(:product, :catalogue, :harvest_batch).
      in(catalogue: sales_catalogue_ids('raw_sales_product')).
      where(id: params[:id]).
      first
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  def converted_product
    items = Inventory::ItemTransaction.includes(:product, :catalogue).
      in(catalogue: sales_catalogue_ids(Constants::CONVERTED_PRODUCT_KEY)).
      where(id: params[:id]).
      first
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  private

  def sales_catalogue_ids(type)
    Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, type).result.pluck(:value)
  end

  def request_with_errors(errors)
    params[:sales_product].to_unsafe_h.merge(errors: errors)
  end
end
