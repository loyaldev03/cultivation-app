class Api::V1::ProductsController < Api::V1::BaseApiController
  def index
    type = params[:type]
    category = params[:category]
    facility_id = params[:facility_id].to_s
    # TODO: Why???
    facility_id = Cultivation::Batch.find(params[:batch_id].to_s).facility_id if params[:batch_id]
    facility_strain_id = params[:facility_strain_id].to_s

    #same as query in products index, query_raw_material_with_relationship, should move to cmd ?
    special_type = ['seeds', 'purchased_clones', 'nutrients']
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

    products = []
    if catalogue_ids.blank?
      products = Inventory::Product.all
    else
      if params[:filter].blank?
        products = Inventory::Product.where(:catalogue_id.in => catalogue_ids)
      else
        products = Inventory::Product.where(:catalogue_id.in => catalogue_ids).where(name: /^#{params[:filter]}/i)
      end
    end
    products.includes([:catalogue])

    products = products.where(facility_id: facility_id) if facility_id.present?

    products = products.where(facility_strain_id: facility_strain_id) if facility_strain_id.present?

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
                  else
                    raise 'Need at least batch id, facility strain id or facility id'
                  end

    valid_categories =
      Inventory::Catalogue.raw_materials.where(
        category: {'$nin': [
          Constants::NUTRIENTS_KEY,
          Constants::SUPPLEMENTS_KEY,
        ]},
      ).
        where(
        key: {'$nin': [
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
      where(facility_id: facility_id).
      where(name: /^#{params[:filter]}/i).
      where(id: {'$nin': exclude_ids}).
      limit(20).
      order(name: :asc)

    # checklist = products.map {|x| x.name }
    # Rails.logger.debug "\t\t\t\t>>> products: #{products.count}"

    render json: Inventory::ProductSerializer.new(products).serialized_json
  end
end
