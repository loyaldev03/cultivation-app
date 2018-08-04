class HomeController < ApplicationController
  def index
    @dashboard = DashboardForm::DashboardForm.new
  end

  def inventory_setup
  end
end
