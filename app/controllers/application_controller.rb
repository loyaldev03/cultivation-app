class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!

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
end
