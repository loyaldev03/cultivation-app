class Settings::Company::TeamController < ApplicationController
  def index
    #raise Facility.first.inspect
    if params[:onboarding_type].present?
      Facility.first.update_onboarding('ONBOARDING_INVITE_TEAM')
    end
    authorize! :index, Settings::Company::TeamController
  end
end
