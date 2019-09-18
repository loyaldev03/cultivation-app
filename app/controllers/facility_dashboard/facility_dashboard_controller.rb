module FacilityDashboard
  class FacilityDashboardController < ApplicationController
    before_action :verify_facility_setup
    authorize_resource class: false

    def index
    end

    def summary
    end
  end
end
