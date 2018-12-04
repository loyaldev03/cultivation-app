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
end
