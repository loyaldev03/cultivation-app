class Inventory::RawMaterialsController < ApplicationController
  before_action :setup_editor_data, :set_facility_id

  def nutrients
    @uoms = Common::UnitOfMeasure.all.pluck(:unit)
    @catalogue_id = Inventory::QueryCatalogue.call(Constants::NUTRIENTS_KEY).result&.id.to_s
  end

  def grow_medium
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::GROW_MEDIUM_KEY).result
  end

  def grow_lights
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::GROW_LIGHT_KEY).result
  end

  def supplements
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::SUPPLEMENTS_KEY).result
  end

  def others
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::OTHERS_KEY).result
  end

  def seeds
    @facility_strains = Inventory::QueryFacilityStrains.call.result
    @uoms = Inventory::Catalogue.seed.uoms.pluck(:unit)
  end

  def purchased_clones
    @facility_strains = Inventory::QueryFacilityStrains.call.result
    @uoms = Inventory::Catalogue.purchased_clones.uoms.pluck(:unit)
  end

  private

  def set_facility_id
    @facility_id = params[:facility_id]
  end

  def setup_editor_data
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece)).pluck(:unit)
  end
end
