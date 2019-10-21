class Api::V1::ProductsController < Api::V1::BaseApiController
  def index
    type = params[:type]
    category = params[:category]
    facility_id = params[:facility_id].to_s
    # TODO: Why???
    facility_id = Cultivation::Batch.find(params[:batch_id].to_s).facility_id if params[:batch_id]
    catalogue_id = params[:catalogue_id].to_bson_id
    facility_strain_id = params[:facility_strain_id].to_s

    if type == 'raw_materials'
      # same as query in products index, query_raw_material_with_relationship, should move to cmd ?
      special_type = ['seeds', 'purchased_clones']
      catalogue_ids = if special_type.include?(category)
                        # find parent only one
                        Inventory::Catalogue.raw_materials.where(
                          key: category,
                        ).pluck(:id)
                      else
                        # find catalogue for other than parent, parent will never have category type
                        Inventory::Catalogue.raw_materials.where(
                          category: category,
                        ).pluck(:id)
                      end
    end

    if type == 'non_sales'
      catalogue_ids = Inventory::Catalogue.non_sales.where(
        category: category,
      ).pluck(:id)
    end

    products = []

    if catalogue_id.present?
      products = Inventory::Product.where(catalogue_id: catalogue_id)
    elsif catalogue_id.blank? || catalogue_ids.blank? || type.nil? && category.nil?
      products = Inventory::Product.all
    else
      products = Inventory::Product.where(:catalogue_id.in => catalogue_ids)
    end

    products.includes([:catalogue])

    products = products.where(facility_id: facility_id) if facility_id.present?

    products = products.where(facility_strain_id: facility_strain_id) if facility_strain_id.present?

    products = products.where(name: /.*#{params[:filter]}.*/i) if params[:filter].present?

    products = products.limit(7).order(name: :asc)
    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  # Returns list of products that is not nutrient/ supplement related.
  def non_nutrients
    # TODO: Unit test to test if all producst from valid catalogue are returned
    facility_id = if params[:batch_id].present?
                    Cultivation::Batch.find(params[:batch_id]).facility_id
                  elsif params[:facility_strain_id].present?
                    Inventory::FacilityStrain.find(params[:facility_strain_id]).facility_id
                  elsif params[:facility_id].present?
                    params[:facility_id]
                  end

    valid_categories =
      Inventory::Catalogue.raw_materials.where(
        category: {'$nin': [
          Constants::SUPPLEMENTS_KEY,
        ]},
      ).
        where(
        key: {'$nin': [
          Constants::NUTRIENTS_KEY,
          Constants::SEEDS_KEY,
          Constants::PURCHASED_CLONES_KEY,
        ]},
      ).
        concat(Inventory::Catalogue.non_sales).
        pluck(:id)

    exclude_ids = if params[:exclude].present?
                    params[:exclude].split(',')
                  else
                    []
                  end

    # Rails.logger.debug "\t\t\t\t>>> exclude_ids: #{exclude_ids}"

    products = Inventory::Product.includes([:catalogue]).
      in(catalogue: valid_categories).
      where(name: /.*#{params[:filter]}.*/i).
      where(id: {'$nin': exclude_ids}).
      limit(20).
      order(name: :asc)
    products = products.where(facility_id: facility_id) if facility_id.present?
    # checklist = products.map {|x| x.name }
    # Rails.logger.debug "\t\t\t\t>>> products: #{products.count}"

    render json: Inventory::ProductSerializer.new(products).serialized_json
  end

  def upc
    payload = {upc: params[:upc]}
    uri = URI.parse('https://api.upcitemdb.com/prod/v1/lookup')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request.body = payload.to_json
    request['Content-Type'] = 'application/json'
    request[CaseSensitiveString.new('user_key')] = Rails.application.credentials.upcitemdb[:user_key]
    request[CaseSensitiveString.new('key_type')] = '3scale'

    res = http.request(request)

    case res.code
    when '200'
      render json: {data: JSON.parse(res.body)['items'][0]}
    else
      render json: {data: 'Error retrieving product'}
    end
  end

  def item_categories
    categories = Inventory::ItemCategory.order(is_active: -1, name: 1)
    render json: ItemCategorySerializer.new(categories).serialized_json
  end

  def product_categories
    records = Inventory::ProductCategory.where(deleted: {"$ne": true}).to_a
    render json: Inventory::ProductCategorySerializer.new(records).serialized_json
  end

  def product_subcategories
    result = Inventory::ProductCategory.collection.aggregate([
                                                               {"$unwind": '$sub_categories'},
                                                               {"$project": {
                                                                 'id': '$_id',
                                                                 'name': '$sub_categories.name',
                                                                 'category_name': '$name',
                                                                 'quantity_type': 1,
                                                                 'is_used': 1,
                                                                 'is_active': 1,
                                                                 'metrc_item_category': 1,
                                                                 'deleted': 1,
                                                                 'package_units': '$sub_categories.package_units',
                                                               }},
                                                             ])
    sub_category = Struct.new(:id, :name, :quantity_type, :is_used, :is_active, :metrc_item_category, :deleted, :package_units, :category_name)

    arrays_result = result.to_a.map do |a|
      sub_category.new(
        a['id'], a['name'], a['quantity_type'], a['is_used'],
        a['is_active'], a['metrc_item_category'], a['deleted'],
        a['package_units'], a['category_name']
      )
    end

    render json: Inventory::ProductSubCategorySerializer.new(arrays_result).serialized_json
  end

  def update_product_categories
    # Try to find category by id first, follow by name
    category = Inventory::ProductCategory.find_by(id: params[:id])
    category ||= Inventory::ProductCategory.find_or_initialize_by(name: params[:name])
    # New record are set to active automatically.
    category.is_active = category.new_record? ? true : params[:is_active]
    # if previously category was deleted, and user created a new record with same name
    # we change the active flag to true
    if category.deleted
      category.is_active = true
      category.sub_categories = []
    end
    category.deleted = params[:deleted] == true
    if category.deleted
      # If user deleted record, set active to false
      category.is_active = false
    end
    # WeightBased / CountBased, copy from METRC Item Category
    category.metrc_item_category = params[:metrc_item_category]
    if category.metrc_item_category
      found = Inventory::ItemCategory.find_by(name: category.metrc_item_category)
      if found.present?
        category.quantity_type = found&.quantity_type
      else
        category.quantity_type = params[:quantity_type]
      end
    end

    category.package_units = []

    if !params[:package_units].blank?
      params[:package_units].each do |x|
        category.package_units.build(
          value: x[:value],
          label: x[:label],
          uom: get_uom(x),
          quantity_in_uom: get_quantity_in_uom(x),
          is_active: x[:is_active],
        )
      end
    end

    category.save!
    render json: Inventory::ProductCategorySerializer.new(category).serialized_json
  end

  def update_product_subcategory
    if params[:deleted] == true
      cmd = Inventory::DeleteProductSubCategory.call(params[:id])
      if cmd.success?
        render json: Inventory::ProductCategorySerializer.new(cmd.result).serialized_json
      else
        render json: cmd.errors.to_json
      end
      return
    end

    # Updating
    if params[:id].present?
      cmd = Inventory::UpdateProductSubCategory.call(sub_category_id: params[:id],
                                                     sub_category_name: params[:name],
                                                     package_units: params[:package_units])
      if cmd.success?
        render json: Inventory::ProductCategorySerializer.new(cmd.result).serialized_json
      else
        render json: cmd.errors.to_json
      end
      return
    end

    # Creating
    if params[:product_category_id].present?
      cmd = Inventory::CreateProductSubCategory.call(product_category_id: params[:product_category_id],
                                                     sub_category_name: params[:name],
                                                     package_units: params[:package_units])
      if cmd.success?
        render json: Inventory::ProductCategorySerializer.new(cmd.result).serialized_json
      else
        render json: cmd.errors.to_json
      end
    end
  end

  def items
    items = Inventory::Item.
      where(facility_id: params[:facility_id]).
      order(name: 1)
    render json: ItemSerializer.new(items).serialized_json
  end

  def update_item_category
    category = Inventory::ItemCategory.find(params[:id])
    category.is_active = params[:is_active]
    category.save
    render json: ItemCategorySerializer.new(category).serialized_json
  end

  private

  def get_uom(unit)
    if unit[:uom].present?
      return unit[:uom][:value]
    else
      wu = Constants::BUILTIN_WEIGHT_UNITS.find { |a| a[:label] == unit[:label] }
      return wu[:uom] if wu.present?
    end
  end

  def get_quantity_in_uom(unit)
    if unit[:quantity].present?
      return unit[:quantity]
    else
      wu = Constants::BUILTIN_WEIGHT_UNITS.find { |a| a[:label] == unit[:label] }
      return wu[:quantity_in_uom] if wu.present?
    end
  end
end
