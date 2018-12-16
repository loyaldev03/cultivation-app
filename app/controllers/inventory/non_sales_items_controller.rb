class Inventory::NonSalesItemsController < ApplicationController
  before_action :setup_editor_data

  def index
    @catalogues = Inventory::Catalogue.where(catalogue_type: 'non_sales_product')
  end

  private

  def setup_editor_data
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(pieces weights volumes)).pluck(:unit)
  end
end
