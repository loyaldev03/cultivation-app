class Inventory::RawMaterialsController < ApplicationController
  before_action :setup_editor_data, :set_facility_id
  before_action :set_uoms, except: [:seeds, :purchased_clones]
  authorize_resource class: false

  def nutrients
    if params[:onboarding_type].present?
      current_facility.update_onboarding('ONBOARDING_RAW_MATERIALS')
    end
    @catalogue_id = Inventory::QueryCatalogue.call(Constants::NUTRIENTS_KEY).result&.id.to_s
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::NUTRIENTS_KEY).result
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
    if params[:onboarding_type].present?
      current_facility.update_onboarding('ONBOARDING_OTHER_MATERIALS')
    end
    @catalogues = Inventory::QueryCatalogueTree.call('raw_materials', Constants::OTHERS_KEY).result
  end

  def seeds
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
    @uoms = Inventory::Catalogue.seed.uoms.pluck(:unit)
  end

  def purchased_clones
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
    @uoms = Inventory::Catalogue.purchased_clones.uoms.pluck(:unit)
  end

  private

  def set_uoms
    @uoms = Common::UnitOfMeasure.all.pluck(:unit)
  end

  def set_facility_id
    @facility_id = params[:facility_id]
  end

  def setup_editor_data
    @scanditLicense = ENV['SCANDIT_LICENSE'] || 'AVe8MQbfGjJxQJEE+QVlV0EBEY6rBvsRMWlDKqo98mQATwwAS1BtJrtGCslZEK53DH06b+Q/OgabNbrRrUUNNvBL2exdQfSWajf13ms38pvLRuJ6k2rnrW9nprt0R1W54lszn8Y+ryORQkFDzQkdqKGjLQDi1GIqkIlNPU4oKheZ1WLLq8wM7AP8VfdGYJ1BLkbtW3RygNb4b/sOYiO0OpIK6Wij7HcSOJZWnK56Uvk6vTKIBT6K74ULnFM1LG++KHFwAT3fqG19wXdJMwnOPzla1Pm02vqmO25V3nrpceNGm2+SKU8o1qqIe+y6HAITF7y29l/ilIiTtqkijjyK6i5u47akgqrjBNkerKUgX1/AYRrKLSV2xZqqNB8Ul9unKKBQsyygAi+ScpOvrU4Kj5hPhRnfSIfO9p5WsrG/8BtJ89Cf7K9eRlC3/y+78i2HbN/+f7iTOrI4/xTjK8+B4VHbvod6pa8Xu/hAENGqnj49drTVRvXhZFCg6FHfqVEoiodb/RNQAtZNigP48/2fAtte95KZSVwCW/0XFx9/ek4/ZSXFwRZYzzqn++xmIfGGMfbX9UbAKRiqb6IuO7yrnnxfcdOrOB8yYkcmjb8xx8+FLA+VajClyORrkMtv/Bhkgio6oribFw6tbC+RJeHPO1mLD8W3mY8WCrZPWrVwk767K5boEU6nna1gCQXvwfWPPGMwO5XFTxkU9KuutVvrs/sNyc/UAM5wWx6BQXtdfDn2codtOyDmkx1iHaSkXjAxfXlOsJcIn05P/7nJX+SBqbDtrbwf8VB724YgGcCjlS1AS/oPYOx1lkU8yOIzmzY='
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece)).pluck(:unit)
  end
end
