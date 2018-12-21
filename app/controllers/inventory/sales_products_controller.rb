class Inventory::SalesProductsController < ApplicationController
  def harvest_packages
    @facility_strains = Inventory::QueryFacilityStrains.call.result
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, 'raw_sales_product').result
    @drawdown_uoms = Common::UnitOfMeasure.where(dimension: 'weight').map &:unit
    @locations = QueryAllValidFacilityLocations.call.result

    harvest_batches = Inventory::HarvestBatch.where(status: 'new')
    options = {params: {include: [:facility]}}
    @harvest_batches = Inventory::HarvestBatchSerializer.new(harvest_batches, options).serializable_hash[:data]
  end

  def convert_products
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, Constants::SALES_PRODUCT_KEY).result
    @locations = QueryAllValidFacilityLocations.call.result
    @breakdown_uoms = Common::UnitOfMeasure.where(dimension: 'piece').
      pluck(:unit).concat(Common::UnitOfMeasure.where(dimension: 'weight').pluck(:unit))
  end

  def product_info
    render plain: 'product_info'
  end
end
