class Settings::Company::TeamController < ApplicationController
  def index
    authorize! :index, Settings::Company::TeamController
  end
end
