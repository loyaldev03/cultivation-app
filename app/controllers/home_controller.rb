class HomeController < ApplicationController
  def index
    @home = OpenStruct.new({
      last_facility: Facility.last,
      has_inventories: Inventory::ItemArticle.all.any?,
      has_batches: Cultivation::Batch.all.any?,
    })
  end

  def dashboard
    @dashboard = DashboardForm::DashboardForm.new
  end

  def inventory_setup
  end
end
