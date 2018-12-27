class Inventory::NonSalesItemsController < ApplicationController
  before_action :setup_editor_data

  def index
    @catalogues = Inventory::QueryCatalogueTree.call(Constants::NON_SALES_KEY, Constants::NON_SALES_KEY)
  end

  private

  def setup_editor_data
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece weight volume)).pluck(:unit)
  end
end
