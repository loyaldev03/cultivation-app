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

    serialized_json = Inventory::HarvestPackageSerializer.new(
      items,
      params: {query: QueryLocations.call(params[:facility_id])},
    ).serializable_hash[:data]

    render json: {data: serialized_json}
  end

  def harvest_packages
    items = Inventory::ItemTransaction.where(facility_id: params[:facility_id]).includes(:product, :catalogue, :harvest_batch).
      in(catalogue: sales_catalogue_ids('raw_sales_product')).
      order(c_at: :desc)

    serialized_json = Inventory::HarvestPackageSerializer.new(
      items,
      params: {query: QueryLocations.call(params[:facility_id])},
    ).serializable_hash[:data]

    render json: {data: serialized_json}
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

  # TODO: create_harvest_products
  def scan_and_create
    command = Inventory::SavePackageFromScan.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: Inventory::HarvestPackageSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  # TODO: is it not the same as harvest package?
  def harvest_products
    product_type = params[:product_type]
    package_type = params[:package_type]
    cultivation_batch_id = params[:cultivation_batch_id]

    catalogue = Inventory::Catalogue.find_by(label: product_type, category: 'raw_sales_product')
    cultivation_batch = Cultivation::Batch.find(cultivation_batch_id)
    facility = cultivation_batch.facility
    facility_strain = cultivation_batch.facility_strain

    product = Inventory::Product.find_by(
      facility: facility,
      facility_strain: facility_strain,
      catalogue: catalogue,
      package_type: package_type,
    )

    packages = Inventory::ItemTransaction.where(
      catalogue: catalogue,
      product: product,
    ).
      order(created_at: :desc)

    packages_json = packages.map do |x|
      {
        id: x.id.to_s,
        tag: x.package_tag,
        product_id: x.product.id.to_s,
        product_type: x.catalogue.label,
        package_type: x.product.package_type,
        event_type: 'create_package',
      }
    end

    render json: packages_json, status: 200
  end

  private

  def sales_catalogue_ids(type)
    Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, type).result.pluck(:value)
  end

  def request_with_errors(errors)
    params[:sales_product].to_unsafe_h.merge(errors: errors)
  end
end
