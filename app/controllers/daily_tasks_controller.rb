class DailyTasksController < ApplicationController
  def index
    @facility_id = current_default_facility.id.to_s
    @nutrient_ids = Inventory::Catalogue.where(category: Constants::NUTRIENTS_KEY).where(:sub_category.ne => '').map { |x| x.id.to_s }
    @nutrient_ids.concat(Inventory::Catalogue.where(category: Constants::SUPPLEMENTS_KEY).map { |x| x.id.to_s })
    render 'index', layout: 'worker'
  end

  private
end
