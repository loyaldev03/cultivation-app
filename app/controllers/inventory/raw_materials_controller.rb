class Inventory::RawMaterialsController < ApplicationController
  before_action :setup_editor_data, only: [:nutrients, :grow_medium, :grow_lights, :supplements, :others]

  def nutrients
  end

  def grow_medium
  end

  def grow_lights
  end

  def supplements
  end

  def others
  end

  private

  def setup_editor_data
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(pieces weights volumes)).pluck(:unit)
  end
end
