class Inventory::SalesProductsController < ApplicationController
  authorize_resource class: false

  def products
    if params[:onboarding_type].present?
      current_facility.update_onboarding('ONBOARDING_PACKAGE_INVENTORY')
    end
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
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
    @scanditLicense = ENV['SCANDIT_LICENSE'] || 'AVe8MQbfGjJxQJEE+QVlV0EBEY6rBvsRMWlDKqo98mQATwwAS1BtJrtGCslZEK53DH06b+Q/OgabNbrRrUUNNvBL2exdQfSWajf13ms38pvLRuJ6k2rnrW9nprt0R1W54lszn8Y+ryORQkFDzQkdqKGjLQDi1GIqkIlNPU4oKheZ1WLLq8wM7AP8VfdGYJ1BLkbtW3RygNb4b/sOYiO0OpIK6Wij7HcSOJZWnK56Uvk6vTKIBT6K74ULnFM1LG++KHFwAT3fqG19wXdJMwnOPzla1Pm02vqmO25V3nrpceNGm2+SKU8o1qqIe+y6HAITF7y29l/ilIiTtqkijjyK6i5u47akgqrjBNkerKUgX1/AYRrKLSV2xZqqNB8Ul9unKKBQsyygAi+ScpOvrU4Kj5hPhRnfSIfO9p5WsrG/8BtJ89Cf7K9eRlC3/y+78i2HbN/+f7iTOrI4/xTjK8+B4VHbvod6pa8Xu/hAENGqnj49drTVRvXhZFCg6FHfqVEoiodb/RNQAtZNigP48/2fAtte95KZSVwCW/0XFx9/ek4/ZSXFwRZYzzqn++xmIfGGMfbX9UbAKRiqb6IuO7yrnnxfcdOrOB8yYkcmjb8xx8+FLA+VajClyORrkMtv/Bhkgio6oribFw6tbC+RJeHPO1mLD8W3mY8WCrZPWrVwk767K5boEU6nna1gCQXvwfWPPGMwO5XFTxkU9KuutVvrs/sNyc/UAM5wWx6BQXtdfDn2codtOyDmkx1iHaSkXjAxfXlOsJcIn05P/7nJX+SBqbDtrbwf8VB724YgGcCjlS1AS/oPYOx1lkU8yOIzmzY='
  end

  def product_info
    render plain: 'product_info'
  end
end
