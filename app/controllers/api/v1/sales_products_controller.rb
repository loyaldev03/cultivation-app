class Api::V1::SalesProductsController < Api::V1::BaseApiController
  def setup_harvest_package
    command = Inventory::SetupHarvestPackage.call(current_user, params[:sales_product].to_unsafe_h)
    if command.success?
      render json: Inventory::HarvestPackageSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(errors), status: 422
    end
  end

  def setup_sales_product
  end

  def products
    products = []
    if params[:filter].blank?
      products = Inventory::Product.in(catalogue: sales_catalogue_ids).limit(7).order(name: :asc)
    else
      products = Inventory::Product.in(catalogue: sales_catalogue_ids).where(:name => /^#{params[:filter]}/i).limit(7).order(name: :asc)
    end
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  def harvest_packages
    items = Inventory::ItemTransaction.includes(:product, :catalogue, :harvest_batch).
      in(catalogue: sales_catalogue_ids).
      order(c_at: :desc)
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  def harvest_package
    items = Inventory::ItemTransaction.includes(:product, :catalogue, :harvest_batch).
      in(catalogue: sales_catalogue_ids).
      where(id: params[:id]).
      first
    render json: Inventory::HarvestPackageSerializer.new(items).serialized_json
  end

  private

  def sales_catalogue_ids
    Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, 'raw_sales_product').result.pluck(:value)
  end

  def request_with_errors(errors)
    params[:plant].to_unsafe_h.merge(errors: errors)
  end
end
