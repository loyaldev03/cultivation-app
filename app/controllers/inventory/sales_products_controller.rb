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
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, Constants::CONVERTED_PRODUCT_KEY).result
    @locations = QueryAllValidFacilityLocations.call.result
    @breakdown_uoms = Common::UnitOfMeasure.where(dimension: 'piece').
      pluck(:unit).concat(Common::UnitOfMeasure.where(dimension: 'weight').pluck(:unit))
    @scanditLicense = ENV['SCANDIT_LICENSE'] || 'AWBsKgHJHZNPG18CMjDOp6YARpP2P9ZpR2Zl8kskc6rmZ7o+RWKD5c1NHDNHHbnq31POoHVBNoB/Q91CR1hmVMM8NXgmZf+LmFY3ZTxMhdxFbxwgdxqj1u18ZLAAQWG8MVUAjKM9OgrrPQtMzwI/xUN0ZaIjLTjQ7i68sYA82p4dsYf3B3bIFi3BR+tItjEzoNxMqOgAiUDMd2qC9eDM79Itx+e3NgqaJ3uc2W7KXWJgVQRUUrgFP1eXaMFoTrSi7D8koF+yQKqTOYPR7V1934ZxFp1Z9PV15H9drhfEJuryQsn1bZiJ3BhlMF7dOCFSoTMQaod0gnUSk4+uBhsdxux4z5iJwzfTuqq0Sa+7/SaILfuVMwcQz4+dDwRsolwsDsMhdeEY5fV9gmds3YNeOCZN2xIp0TFuXuVI/VbBV2Y2n3vt69MKqpYCGdTuZmVUwT5l2XiybcRul18BxUYZaw1SSLybut0+IjVbSpHJmpJXdQjRyKyLrlxJF7q2eimv513ltTjc/v85h5rFc+LKjh/TjS6fypg3NLlHllN1MOGXbIpqzVtajf0UF4x0BdpV49yfn/M0QIuh2cFblqGC8ElhadOaQ2OUtex4m7nIdlkU4TvnvTqjO2NAo+iBt1ySnP8yHDo5CgbKIzOCOek2Q1807QK8UxepOS8lGh+Hf5qe5xILtiR78OlD1euNcPvPjLtp94fthufbKNL37W/7IQe/mfMLffpnER/drhx5dWBBt5kuLVX3EiWdGhZ3MACCG2ZyUYVFqSS8/oTn4UtMW6HErChOftFdVfP709oXe3VHEhYUagfzZ5sX56llWSU='
  end

  def product_info
    render plain: 'product_info'
  end
end
