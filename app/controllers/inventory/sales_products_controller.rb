class Inventory::SalesProductsController < ApplicationController
  authorize_resource class: false

  def products
    if params[:onboarding_type].present?
      current_user_facilities.each do |f|
        f.update_onboarding('ONBOARDING_PACKAGE_INVENTORY')
      end
    end
    @facility_strains = Inventory::QueryFacilityStrains.call(
      selected_facilities_ids,
    ).result
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, 'raw_sales_product').result
    @drawdown_uoms = Common::UnitOfMeasure.where(dimension: 'weight').map &:unit

    strains = Inventory::FacilityStrain.where(facility: current_facility).pluck(:id)
    harvest_batches = Inventory::HarvestBatch.in(facility_strain: strains)
    options = {params: {include: [:facility]}}
    @harvest_batches = Inventory::HarvestBatchSerializer.new(harvest_batches, options).serializable_hash[:data]
    current_facility_id = params[:facility_id] == 'All' ? current_user_facilities_ids : current_facility.id
    @users = User.in(facilities: current_facility_id).map do |u|
      {
        id: u.id.to_s,
        name: u.display_name,
      }
    end
  end

  def convert_products
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, Constants::CONVERTED_PRODUCT_KEY).result
    @breakdown_uoms = Common::UnitOfMeasure.where(dimension: 'piece').
      pluck(:unit).concat(Common::UnitOfMeasure.where(dimension: 'weight').pluck(:unit))
    @scanditLicense = ''
  end

  def product_info
    render plain: 'product_info'
  end
end
