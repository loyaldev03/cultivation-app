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
        event_type: x.event_type,
      }
    end

    render json: packages_json, status: 200
  end

  def harvest_products_from_package
    product_type = params[:product_type]
    package_type = params[:package_type]
    ref_id = params[:source_package_id]

    catalogue = Inventory::Catalogue.find_by(label: product_type, category: 'raw_sales_product')
    source_package = Inventory::ItemTransaction.find(ref_id)
    cultivation_batch = source_package.harvest_batch.cultivation_batch
    facility = cultivation_batch.facility
    facility_strain = cultivation_batch.facility_strain
    product = Inventory::Product.find_by(
      facility: facility,
      facility_strain: facility_strain,
      catalogue: catalogue,
      package_type: package_type,
    )

    packages = Inventory::ItemTransaction.where(
      ref_id: ref_id.to_bson_id,
      event_type: 'convert_package_from_scan',
      product_id: product.id,
    ).
      order(created_at: :desc)

    packages_json = packages.map do |x|
      {
        id: x.id.to_s,
        tag: x.package_tag,
        product_id: x.product.id.to_s,
        product_type: x.catalogue.label,
        package_type: x.product.package_type,
        event_type: x.event_type,
      }
    end

    render json: packages_json, status: 200
  end

  def product_plans
    plans = Inventory::ConvertProductPlan.where(package_id: params[:id])
    plans_json = plans.map do |p|
      {
        id: p.id.to_s,
        product_type: p.product_type,
        package_type: p.package_type,
        quantity: p.quantity,
        uom: p.uom,
        conversion: p.conversion,
        total_weight: p.total_weight,
      }
    end

    task = Cultivation::Task.find_by(
      indelible: 'convert_product',
      duration: 1,
      package_id: params[:id].to_bson_id, # associate task to this package
    )

    if (task)
      task = {
        assign_to: task.users.empty? ? nil : task.users.first.id.to_s,
        start_date: task.start_date ? task.start_date.iso8601 : nil,
      }
    end

    render json: {product_plans: plans_json, task: task}, status: 200
  end

  def conversion_plans_by_task
    task = Cultivation::Task.find(params[:task_id])
    package_id = task.package_id
    plans = Inventory::ConvertProductPlan.where(package_id: package_id)
    plans_json = plans.map do |p|
      {
        id: p.id.to_s,
        source_package_id: p.package.id.to_s,
        product_type: p.product_type,
        package_type: p.package_type,
        quantity: p.quantity,
        uom: p.uom,
        conversion: p.conversion,
        total_weight: p.total_weight,
      }
    end

    render json: plans_json, status: 200
  end

  def scan_and_convert
    command = Inventory::ConvertPackageFromScan.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: Inventory::HarvestPackageSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def save_product_plans
    package = Inventory::ItemTransaction.find(params[:id])
    Inventory::ConvertProductPlan.where(package: package).destroy_all
    package_plans = []
    product_plans = params[:product_plans]
    product_plans.each do |pp|
      product_type = pp[:product_type]
      pp[:package_plans].each do |pkg_plan|
        package_plan = Inventory::ConvertProductPlan.create!(
          product_type: product_type,
          quantity: pkg_plan[:quantity],
          package_type: pkg_plan[:package_type],
          uom: pkg_plan[:uom],
          total_weight: pkg_plan[:converted_qty],
          package: package,
        )
        package_plans << package_plan
      end
    end

    # Rails.logger.debug package_plans.inspect

    plans_json = package_plans.map do |p|
      {
        id: p.id.to_s,
        product_type: p.product_type,
        package_type: p.package_type,
        quantity: p.quantity,
        uom: p.uom,
        conversion: p.conversion,
        total_weight: p.total_weight,
      }
    end

    start_date = params[:start_date]
    task = Cultivation::Task.find_or_initialize_by(
      indelible: 'convert_product',
      duration: 1,
      package_id: params[:id].to_bson_id, # associate task to this package
    )
    task.name = "Convert product - #{package.product_name}"
    task.start_date = start_date
    task.end_date = Time.parse(start_date) + 1.day if !params[:start_date].blank?
    task.facility_id = current_default_facility.id
    task.save!

    if !params[:assign_to].blank?
      user = User.find_by(id: params[:assign_to])
      # Rails.logger.debug "\t\t\t>>>>>>>>>>>>>>>>>>>>>>>>> user: #{user.inspect}"
      task.user_ids = [user&.id]
    else
      task.user_ids = []
    end
    task.save!

    render json: plans_json, status: 200
  end

  private

  def sales_catalogue_ids(type)
    Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, type).result.pluck(:value)
  end

  def request_with_errors(errors)
    params[:sales_product].to_unsafe_h.merge(errors: errors)
  end
end
