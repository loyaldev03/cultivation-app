class Inventory::ItemsController < ApplicationController
  def nutrients
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(pieces weights volumes)).pluck(:unit)
  end

  def grow_medium
  end

  def grow_lights
    render plain: 'grow_lights'
  end

  def supplements
    render plain: 'supplements'
  end

  def others
    render plain: 'others'
  end
end
