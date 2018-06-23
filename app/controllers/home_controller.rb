class HomeController < ApplicationController
  def index
    @dashboard = DashboardForm::DashboardForm.new
  end
end
