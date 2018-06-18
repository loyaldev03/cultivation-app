class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!
  before_action :facility_ready?

  layout :layout_by_resource

  private

  def miniprofiler
    # Enable mini profiler only if developer login
    Rack::MiniProfiler.authorize_request if current_user && current_user.is_dev?
  end

  def layout_by_resource
    if devise_controller?
      'login'
    else
      'application'
    end
  end

  # If no facility is ready, shows the layout without sidebar/ settings.
  def facility_ready?
    Facility.where(is_complete: true).count > 0
  end
end
